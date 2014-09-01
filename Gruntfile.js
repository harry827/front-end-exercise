module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %>  <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            gotop: {
                options: {
                    banner: '/*! jquery.gotop <%= grunt.template.today("yyyy-mm-dd") %> */\n'
                },
                src: 'GoTop/jquery.gotop.js',
                dest: 'GoTop/jquery.gotop.min.js'
            },
            sortable: {
                options: {
                    banner: '/*! jquery.sortable <%= grunt.template.today("yyyy-mm-dd") %> */\n'
                },
                src: 'sortable/jquery.sortable.js',
                dest: 'sortable/jquery.sortable.min.js'
            }
        }

    });

    // 加载包含 "uglify" 任务的插件。
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // 默认被执行的任务列表。
    grunt.registerTask('default', ['uglify:sortable']);

};