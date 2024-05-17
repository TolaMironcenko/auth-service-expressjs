FROM scratch
ADD alpine-minirootfs-3.19.1-x86_64.tar.gz /
WORKDIR /srv/notes_service
COPY . /srv/notes_service/
RUN apk add nodejs npm && npm install && rm -v alpine-minirootfs-3.19.1-x86_64.tar.gz