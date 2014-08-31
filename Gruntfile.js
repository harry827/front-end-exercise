module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! jquery.gotop <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'GoTop/jquery.gotop.js',
        dest: 'GoTop/jquery.gotop.min.js'
      }
    }
      
  });

  // 加载包含 "uglify" 任务的插件。
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // 默认被执行的任务列表。
  grunt.registerTask('default', ['uglify']);

};