pipeline{
    agent any
    environment{
        IMAGE_NAME = 'vt-admin-app'
        CONTAINER_NAME = 'vt-admin-app'
        ACCESS_PORT = '65000'
        BASE_API = 'http://host.docker.internal:8080/'
    }
    stages{
        stage('build'){
            agent{
                docker{
                    reuseNode true
                    image "node:14.18"
                    args "-v \$HOME/.npm:/root/.npm"
                    args "-v \$HOME/.local/share/pnpm:/root/.local/share/pnpm"
                    args "-e TZ=Asia/Shanghai"
                }
            }
            steps{
                sh "rm -rf pnpm-lock.yaml"
                sh "npm install -g pnpm@7.30.5"
                sh "pnpm install"
                sh "pnpm build:docker"
            }
        }
        stage('package'){
            steps{
                sh "docker stop ${CONTAINER_NAME} 2> /dev/null || true"
                sh "docker rm -f ${CONTAINER_NAME} 2> /dev/null || true"
                sh "docker rmi -f ${IMAGE_NAME} 2> /dev/null || true"
                sh "docker build -t ${IMAGE_NAME} ."
            }
        }
        stage('deploy'){
            steps{
                sh "docker run --add-host=host.docker.internal:host-gateway -d --restart on-failure -e TZ=Asia/Shanghai -e API=${BASE_API} -p ${ACCESS_PORT}:80 --name ${CONTAINER_NAME} ${IMAGE_NAME}"
            }
        }
    }
}
