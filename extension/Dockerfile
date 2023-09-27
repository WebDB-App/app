FROM webdb/app
LABEL 	org.opencontainers.image.title="WebDB App" \
		org.opencontainers.image.description="Free and Efficient Database IDE" \
		org.opencontainers.image.vendor="WebDB" \
		com.docker.desktop.extension.api.version="0.3.4" \
		com.docker.desktop.extension.icon="https://webdb.app/public/webdb.svg" \
		com.docker.extension.screenshots='[{"alt":"hello world light mode", "url":"https://docker-extension-screenshots.s3.amazonaws.com/react/hello-world-light.png"}, {"alt":"hello world dark mode", "url":"https://docker-extension-screenshots.s3.amazonaws.com/react/hello-world-dark.png"}]' \
		com.docker.extension.detailed-description="<h1>Free and Efficient Database IDE</h1>" \
		com.docker.extension.publisher-url="https://webdb.app" \
		com.docker.extension.additional-urls='[{"title":"Website","url":"https://webdb.app"}]' \
		com.docker.extension.categories="database" \
		com.docker.extension.changelog="https://demo.webdb.app/changelog.html"

COPY . .

EXPOSE 22073
