module ApiHelpers
  def confirm_email(email)
    request_api('confirm_user', { email: email })
  end

  def api_path
    @config['api_path'] + '/test/'
  end


  def request_api(path, params)
    require 'net/http'
    uri = URI(api_path + path)
    uri.query = URI.encode_www_form(params)
    response = Net::HTTP.get_response(uri)
    ret = nil
    begin
      ret = OpenStruct.new JSON.parse(response.body)['data']
    rescue
      print "Failed to parse body of response for endpoint `#{path}`:\n#{response.inspect}\n" unless response.class <= Net::HTTPSuccess
    end
    ret
  end

  def api_create_and_confirm_user(params = {})
    email = params[:email] || "test-#{Time.now.to_i}-#{rand(1000)}@test.com"
    password = params[:password] || "12345678"
    user = request_api 'user', { name: 'User With Email', email: email, password: password, password_confirmation: password, provider: '' }
    request_api 'confirm_user', { email: email }
    user
  end

  def api_register_and_login_with_email(params = {})
    user = api_create_and_confirm_user(params)
    @driver.navigate.to "#{api_path}session?email=#{user.email}"
    user
  end

  def api_create_team(params = {})
    limits = params[:limits]
    team_name = params[:team] || "TestTeam#{Time.now.to_i}-#{rand(99999)}"
    user = params[:user] || api_register_and_login_with_email
    team = request_api 'team', { name: team_name, email: user.email, limits: limits }
    team
  end

  def api_create_team_and_project(params = {})
    user = params[:user] || api_register_and_login_with_email
    team = request_api 'team', { name: "Test Team #{Time.now.to_i}", slug: "test-team-#{Time.now.to_i}-#{rand(1000).to_i}", email: user.email }
    team_id = team.dbid
    project = request_api 'project', { title: "Test Project #{Time.now.to_i}", team_id: team_id }
    { project: project, user: user, team: team }
  end

  def api_create_team_project_and_claim(quit = false, quote = 'Claim')
    data = api_create_team_and_project
    claim = request_api 'claim', { quote: quote, email: data[:user].email, team_id: data[:team].dbid, project_id: data[:project].dbid }
    @driver.quit if quit
    claim
  end

  def api_create_team_project_claims_sources_and_redirect_to_project_page(count)
    data = api_create_team_and_project
    count.times do |i|
      request_api 'claim', { quote: "Claim #{i}", email: data[:user].email, team_id: data[:team].dbid, project_id: data[:project].dbid }
      request_api 'source', { url: '', name: "Source #{i}", email: data[:user].email, team_id: data[:team].dbid, project_id: data[:project].dbid }
    end
    ProjectPage.new(config: @config, driver: @driver)
  end

  def api_create_team_project_and_link(url = @media_url)
    data = api_create_team_and_project
    data = request_api 'link', { url: url, email: data[:user].email, team_id: data[:team].dbid, project_id: data[:project].dbid }
    data
  end

  def api_create_team_project_and_link_and_redirect_to_media_page(url = @media_url)
    media = api_create_team_project_and_link url
    @driver.navigate.to media.full_url
    sleep 2
    MediaPage.new(config: @config, driver: @driver)
  end

  def api_create_team_project_and_claim_and_redirect_to_media_page(quote = 'Claim')
    media = api_create_team_project_and_claim false, quote
    @driver.navigate.to media.full_url
    sleep 2
    MediaPage.new(config: @config, driver: @driver)
  end

  def api_create_media_and_go_to_search_page
    media = api_create_team_project_and_link
    @driver.navigate.to media.full_url
    @driver.navigate.to @config['self_url'] + '/' + get_team + '/search'
    wait_for_selector(".search__results")
  end

  def api_create_claim_and_go_to_search_page
    media = api_create_team_project_and_claim(false, 'My search result')
    @driver.navigate.to media.full_url

    sleep 8 # wait for Sidekiq

    @driver.navigate.to @config['self_url'] + '/' + get_team + '/search'

    sleep 8 # wait for Godot

    expect(@driver.page_source.include?('My search result')).to be(true)
  end

  def api_create_team_project_and_source(name, url)
    data = api_create_team_and_project
    request_api 'source', { url: url, name: name, email: data[:user].email, team_id: data[:team].dbid, project_id: data[:project].dbid }
  end

  def api_create_team_project_and_source_and_redirect_to_source(name, url)
    source = api_create_team_project_and_source(name, url)
    @driver.navigate.to source.full_url
    sleep 2
    source
  end

  def api_logout
    require 'net/http'
    uri = URI(api_path.gsub('/test/', '/api/users/logout'))
    Net::HTTP.get_response(uri)
  end

  def api_create_team_project_and_two_users
    ret = request_api 'create_team_project_and_two_users', {}
    ret
  end

  def api_create_media(params = {})
    data = params[:data] || api_create_team_and_project
    url = params[:url] || @media_url
    media = request_api 'link', { url: url, email: data[:user].email, team_id: data[:team].dbid, project_id: data[:project].dbid }
    media
  end

  def api_create_project(team_id)
    project = request_api 'project', { title: "TestProject#{Time.now.to_i}-#{rand(1000).to_i}", team_id: team_id }
  end

  def api_create_bot
    request_api 'bot', {}
  end
end
