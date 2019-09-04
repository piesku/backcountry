SOURCES = $(shell find src -name "*.ts")

all: public/opt/game.terser.js
	@printf "Size gzipped (including HTML): %s bytes\n" \
		$(shell gzip public/opt/index.html public/opt/game.terser.js public/opt/models.tfu --stdout | wc -c)

public/js/index.js: $(SOURCES)
	@echo -n "Compiling project... "
	@npx tsc
	@echo "Done"

public/opt/game.rollup.js: public/js/index.js
	@echo -n "Bundling files into one... "
	@npx rollup -c bundle_config.js --silent
	@cp public/*.tfu public/opt/
	@echo "Done"

public/opt/game.trim.js: public/opt/game.rollup.js
	@echo -n "Stripping indents and newlines... "
	@sed  -e "s/^ *//" -e "s://.*::" $< | tr "\n" " " > $@
	@echo "Done"

public/opt/game.terser.js: public/opt/game.trim.js
	@echo -n "Minifying... "
	@npx --quiet terser $< \
		--mangle toplevel \
		--mangle-props regex=/^[A-Z]/ \
		--compress booleans_as_integers,drop_console,ecma=6,passes=3,pure_getters,toplevel,unsafe,unsafe_math \
	> $@
	@echo "Done"
