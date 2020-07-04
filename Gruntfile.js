module.exports = grunt => {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        ts: { default: { tsconfig: "./tsconfig.json" } },
        uglify: {
            options: {
                banner: "/* <%= pkg.name %>@v<%= pkg.version %> */"
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: "dist-js/",
                        src: ["*.js", "**/*.js"],
                        dest: "dist/",
                        ext: ".js"
                    }
                ]
            }
        },
        watch: {
            files: ["src/**/*"],
            tasks: ["ts", "uglify"]
        }
    });

    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.registerTask("default", ["ts", "uglify", "watch"]);
    grunt.registerTask("build", ["ts", "uglify"]);
};
