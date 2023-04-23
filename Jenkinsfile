pipeline{
    agent{
        docker{
            image "node:14.18"
            args "-v \$HOME/.npm:/root/.npm"
            args "-v \$HOME/.local/share/pnpm:/root/.local/share/pnpm"
            args "-e TZ=Asia/Shanghai"
        }
    }
    stages{
        stage('build'){
            steps{
                sh "rm -rf pnpm-lock.yaml"
                sh "npm install -g pnpm@7.30.5"
                sh "pnpm install"
                sh "pnpm build"
            }
        }
    }
}
