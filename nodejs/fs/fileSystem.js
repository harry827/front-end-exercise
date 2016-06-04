/*
 File System:
 文件系统模块是一个简单包装的标准 POSIX 文件 I/O 操作方法集。
 可以通过调用 require("fs") 来获取该模块。文件系统模块中的所有方法均有异步和同步版本。

 文件系统模块中的异步方法需要一个完成时的回调函数作为最后一个传入形参。
 回调函数的构成由您调用的异步方法所决定，通常情况下回调函数的第一个形参为返回的错误信息。
 如果异步操作执行正确并返回，该错误形参则为null或者undefined。

 如果你使用的是同步版本的操作方法，则一旦出现错误，会以通常的抛出错误的形式返回错误。
 你可以用try和catch等语句来拦截错误并使程序继续进行。
 */
var fs = require('fs');

//console.log(process.cwd());

/*
 * API：
 * */

/*
 修改文件名称:
 fs.rename(oldPath, newPath, callback) 异步 版本的rename函数,完成时的回调函数(callback)只接受一个参数:可能出现的异常信息.
 fs.renameSync(oldPath, newPath) 同步 版本的rename

 */
fs.rename('hello.txt', 'hello.txt', function (err) {
    if (err) throw err;
    console.log('rename success');
});

/*
 打开文件:
 fs.open(path, flags, [mode], [callback(err,fd)]) 异步
 fs.openSync(path, flags, [mode]) 同步

 参数：
 path     文件路径
 flags    可以是以下的值
 mode     用于设置文件模式 (permission and sticky bits), 不过前提是这个文件是已存在的. 默认情况下是 0666, 有可读和可写权限.

 flags可以是以下的值：
 'r' -  以【只读】的方式打开文件。
 'r+' - 以读写模式打开文件。
 'rs' - 同步模式下，以【只读】的方式打开文件. 指令绕过操作系统的本地文件系统缓存。
 'rs+' - 以同步的方式打开，读取并写入文件。
 注意：rs/rs+：该功能主要用于打开 NFS 挂载的文件, 因为它可以让你跳过默认使用的过时本地缓存.
 但这实际上非常影响 I/O 操作的性能, 因此除非你确实有这样的需求, 否则请不要使用该标志.
 这并不意味着 fs.open() 变成了一个同步阻塞的请求. 如果你想要一个同步阻塞的请求你应该使用 fs.openSync().

 'w' - 以【只写】的形式打开文件. 文件会被创建 (如果文件不存在) 或者覆盖 (如果存在).
 'wx' - 和 ' w ' 模式一样，如果文件存在则返回失败
 'w+' - 以【读写】的方式打开文件. 文件会被创建 (如果文件不存在) 或者覆盖 (如果存在).
 'wx+' - 和'w+'模式一样，如果文件存在则返回失败

 'a' - 以【附加】的形式打开文件，即新写入的数据会附加在原来的文件内容之后. 如果文件不存在则会默认创建.
 'ax' - 类似 'a' 区别是如果文件存在则操作会失败.
 'a+' - 以【读取】和【附加】的形式打开文件. 如果文件不存在则会默认创建.
 'ax+' - 和 'a+' 模式一样，如果文件存在则返回失败

 callback(err,fd) 接收两个参数：
 和一个异常err
 回调函数会传递一个文件描述符 fd

 */
fs.open('ES6-in-depth.pdf', 'r+', function (err, fd) {
    if (err) {
        throw err;
    }
    console.log(fd);
});

/*
 文件内容截取操作：
 fs.ftruncate(fd, len, callback) 异步 完成时的回调函数(callback)只接受一个参数:可能出现的异常信息.
 fs.ftruncateSync(fd, len) 同步
 参数：
 fd  文件描述符
 len 截断长度，只保留该字符长度内的字符，超出部分将被清除。
 */
fs.open('ES6-in-depth.pdf', 'r+', function (err, fd) {
    if (err) {
        throw err;
    }
    fs.ftruncate(fd, 1000, function (err) {
        if (err) {
            throw err;
        }
        console.log('文件内容截断成功');
    });
});

/*
 文件内容截取：
 fs.truncate(path, len, callback) 回调函数(callback)只接受一个参数:可能出现的异常信息。
 fs.truncateSync(path, len)
 参数：
 path   文件路径
 len    截断长度，只保留该字符长度内的字符，超出部分将被清除。
 */
fs.truncate('hello.txt', 9, function (err) {
    if (err) throw err;
    console.log('文件内容截断成功');
});

/*
 更改文件所有权:
 fs.chown(path, uid, gid, [callback(err)])
 fs.chownSync(path, uid, gid)
 参数：
 path   目录路径
 uid    用户ID
 gid    群体身份(指共享资源系统使用者的身份)
 callback   传递异常参数 err
 */

/*
 跟上面的作用相同，也是更改文件所有权，不过第一个参数应为文件描述符
 fs.fchown(fd, uid, gid, callback) 回调函数的参数除了出现错误时有一个错误对象外，没有其它参数
 fs.fchownSync(fd, uid, gid)
 */

/*
 更改文件所有权（不解析符号链接）
 符号链接：符号链接又叫软链接,是一类特殊的文件，这个文件包含了另一个文件的路径名(绝对路径或者相对路径)。
 fs.lchown(path, uid, gid, callback) 完成时的回调函数(callback)只接受一个参数:可能出现的异常信息.
 fs.lchownSync(path, uid, gid)
 */

/*
 以异步的方式来改写文件的读写权限:
 fs.chmod(path, mode, callback) 回调函数(callback)只接受一个参数:可能出现的异常信息
 fs.chmodSync(path, mode)
 参数：
 1. path 文件路径
 2. mode 读写权限（如：777）
 3. callback

 第一个参数为文件描述符：
 fs.fchmod(fd, mode, callback)
 fs.fchmodSync(fd, mode)

 仅在 Mac OS X 系统下可用：
 fs.lchmod(path, mode, callback)
 fs.lchmodSync(path, mode)
 */