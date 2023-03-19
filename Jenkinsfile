pipeline{
    agent{
        docker{
            image "node:14.18"
            args "-v \$HOME/.npm:/root/.npm"
            args "-v \$HOME/.local/share/pnpm:/root/.local/share/pnpm"
        }
    }
    stages{
        stage('build'){
            steps{
                sh "npm install -g pnpm"
                sh "pnpm install"
                sh "pnpm build"
            }
        }
    }
}
