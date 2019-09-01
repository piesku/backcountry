all:

.PHONY: public/js/index.js
public/js/index.js:
	npx tsc

public/opt/game.rollup.js: public/js/index.js
	npx rollup -c bundle_config.js
	cp public/*.tfu public/opt/

public/opt/game.trim.js: public/opt/game.rollup.js
	sed  -e "s/^ *//" -e "s://.*::" $< | tr "\n" " " > $@

public/opt/game.terser.js: public/opt/game.trim.js
	npx --quiet terser $< \
		--mangle toplevel \
		--mangle-props regex=/^[^U]/,reserved=[createVertexArray,bindVertexArray,vertexAttribDivisor,drawElementsInstanced] \
		--compress booleans_as_integers,drop_console,ecma=6,passes=3,pure_getters,toplevel,unsafe,unsafe_math \
	> $@

build: public/opt/game.terser.js
	@printf "Size gzipped (including HTML): %s bytes\n" \
		$(shell gzip public/opt/index.html public/opt/game.terser.js public/opt/models.tfu --stdout | wc -c)
