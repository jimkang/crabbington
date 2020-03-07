include config.mk

HOMEDIR = $(shell pwd)
BROWSERIFY = ./node_modules/.bin/browserify
UGLIFY = ./node_modules/uglify-es/bin/uglifyjs
TRANSFORM_SWITCH = -t [ babelify --presets [ es2015 ] --extensions ['.ts'] ]
PLUGIN_SWITCH = -p [tsify]

SRCIMGDIR = static/source-images
RESIZEDDIR = $(SRCIMGDIR)/resized

pushall: sync
	git push origin master

run:
	wzrd app.ts:index.js -- \
		-d \
		$(PLUGIN_SWITCH)

build:
	$(BROWSERIFY) $(PLUGIN_SWITCH) app.ts | $(UGLIFY) -c -m -o index.js

check-build:
	$(BROWSERIFY) $(PLUGIN_SWITCH) app.ts

deploy:
	npm version patch && make build && git commit -a -m"Build" && make pushall

prettier:
	prettier --write index.html

sync:
	scp index.html $(USER)@$(SERVER):$(APPDIR)
	scp index.js $(USER)@$(SERVER):$(APPDIR)
	scp app.css $(USER)@$(SERVER):$(APPDIR)
	rsync -a $(HOMEDIR)/static/ $(USER)@$(SERVER):$(APPDIR)/static \
    --exclude source-images \
		--exclude .git \
    --omit-dir-times \
    --no-perms

set-up-server-dir:
	ssh $(USER)@$(SERVER) "mkdir -p $(APPDIR)/static"

prepare-sheet:
	montage $(RESIZEDDIR)/*.png -tile 1x -background Transparent -geometry '1x1+0+0<' static/sheet.png

resize-source-images:
	 rm $(SRCIMGDIR)/resized/*
	 mogrify -resize 128x128\> -path $(RESIZEDDIR) $(SRCIMGDIR)/*.png
	 mogrify -gravity center -background transparent -extent 128x128 $(RESIZEDDIR)/*.png

# scale-sheet:
# 	ffmpeg -i ../carts/octo.png \
# 		-vf scale=512:512 \
# 		-sws_flags neighbor \
# 		static/sheet.png
