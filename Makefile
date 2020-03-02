BROWSERIFY = ./node_modules/.bin/browserify
UGLIFY = ./node_modules/uglify-es/bin/uglifyjs
TRANSFORM_SWITCH = -t [ babelify --presets [ es2015 ] --extensions ['.ts'] ]
PLUGIN_SWITCH = -p [tsify]

pushall:
	git push origin master

run:
	wzrd app.js:index.js -- \
		-d \
		$(PLUGIN_SWITCH)

build:
	$(BROWSERIFY) $(PLUGIN_SWITCH) app.js | $(UGLIFY) -c -m -o index.js

prettier:
	prettier --write index.html

sync:
	scp index.html $(USER)@$(SERVER):$(APPDIR)
	scp index.js $(USER)@$(SERVER):$(APPDIR)
	scp app.css $(USER)@$(SERVER):$(APPDIR)
	rsync -a $(HOMEDIR)/static/ $(USER)@$(SERVER):/$(APPDIR) \
    --exclude source-images \
		--exclude .git \
    --omit-dir-times \
    --no-perms

set-up-server-dir:
	ssh $(USER)@$(SERVER) "mkdir -p $(APPDIR)/static"

# Convert black pixels to transparent ones, resize, nearest-neighbor-style.
prepare-sheet:
	convert meta/pico-8/sprites.png \
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
