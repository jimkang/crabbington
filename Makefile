BROWSERIFY = ./node_modules/.bin/browserify
UGLIFY = ./node_modules/uglify-es/bin/uglifyjs

pushall:
	git push origin gh-pages

run:
	wzrd app.js:index.js -- \
		-d

# Some apps needs to run at port 80 because some auth APIs will only redirect
# back to port 80/443.
run-on-80:
	sudo wzrd app.js:index.js --port 80 -- -d

build:
	$(BROWSERIFY) app.js | $(UGLIFY) -c -m -o index.js

prettier:
	prettier --single-quote --write "**/*.js"

# Convert black pixels to transparent ones, resize, nearest-neighbor-style.
prepare-sheet:
	convert ../carts/octo.png \
		-alpha set \
		-channel RGBA \
		-fill none \
		-opaque black \
		-filter point \
		-resize 512x512 \
		static/sheet.png

# scale-sheet:
# 	ffmpeg -i ../carts/octo.png \
# 		-vf scale=512:512 \
# 		-sws_flags neighbor \
# 		static/sheet.png
