# Docker aliases for Check development
CHECKAPP="~/git/check"
alias docker_run_npm="cd $CHECKAPP && docker-compose run web npm run"
alias docker_exec_npm="cd $CHECKAPP && docker-compose exec web npm run"
alias dcguard="cd $CHECKAPP && cd check-web && bundle exec guard"
alias dcgit="cd $CHECKAPP && ./bin/git-update.sh"
alias dcpull="cd $CHECKAPP && docker-compose pull && docker-compose build --pull"
alias dcup="cd $CHECKAPP && docker-compose up"
alias dcbuild="docker_run_npm build"
alias dcbuilddev="docker_exec_npm build:dev"
alias dcwatchstyles="docker_exec_npm style:watch:ltr"
alias dcwatchstylesrtl="docker_exec_npm style:watch:rtl"
alias dcnpm="cd $CHECKAPP && docker-compose exec web npm cache clear && docker-compose exec web npm i"
