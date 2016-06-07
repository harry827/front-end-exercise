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
 关闭文件:
 fs.close(fd, callback)
 fs.closeSync(fd)

 参数：
 fd 文件open时传递的文件描述符
 callback 回调
 */

fs.open('hello.txt', 'a', function (err, fd) {
    if (err) {
        throw err;
    }
    fs.futimes(fd, 1388648322, 1388648322, function (err) {
        if (err) {
            throw err;
        }
        console.log('futimes complete');
        fs.close(fd, function () {
            console.log('Done');
        });
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

/*
 获取文件信息:
 fs.stat(path, callback)
 fs.statSync(path)

 参数：
 path   文件路径
 callback(err, stats)  回调，传递两个参数，异常参数err, 文件信息数组 stats

 获取文件信息（不解析符号链接）:
 fs.lstat(path, callback)
 fs.lstatSync(path)

 根据文件描述符获取文件信息:
 fs.fstat(fd, [callback(err, stats)]) //第一个参数为文件描述符
 fs.fstatSync(fd)
 */

fs.stat('hello.txt', function (err, stats) {
    console.log('stats--------------------');
    console.log(stats);
    console.log('stats--------------------');
});
console.log('stats--------------------');
console.log(fs.statSync('hello.txt'));
console.log('stats--------------------');

/*
 创建硬链接:不懂硬链接是啥~
 fs.link(srcpath, dstpath, callback) //回调函数（callback）只接受一个参数：可能出现的异常信息
 fs.linkSync(srcpath, dstpath)

 参数：
 srcpath       为源目录或文件的路径
 dstpath       它是存放转换后的目录的路径，默认为当前工作目录
 callback      回调，传递一个err异常参数
 */
//fs.linkSync('hello.txt', './copy');

/*
 创建符号链接：
 fs.symlink(srcpath, dstpath, [type], callback)
 fs.symlinkSync(srcpath, dstpath, [type])
 参数：
 srcpath  为源目录或文件的路径
 dstpath  它是存放转换后的目录的路径，默认为当前工作目录
 type     默认值：'file' ， 可选值 ‘dir', ‘file', 或者 ‘junction' ，该项仅用于Windows（在其他平台上忽略）。
 注：注意： Windows 系统要求目标路径（译者注：即 dstpath 参数）必须是一个绝对路径，当使用 'junction' 时，dstpath 参数会自动转换为绝对路径。
 */

/*
 读取链接:
 fs.readlink(path, callback)
 fs.readlinkSync(path)
 参数：
 path      路径
 callback  回调，传递2个参数，异常err 和  linkString返回的链接字符串
 */

/*
 获取真实路径，根据相对地址转换为绝对地址：
 fs.realpath(path, [cache], callback)
 fs.realpathSync(path, [cache])

 可以使用process.cwd解决相对路径。
 参数：
 path  路径
 cache 可选，一个文字的映射路径可用于强制一个特定的路径解决或避免额外的fs.stat需要知道真正的路径对象。
 callback(err, resolvedPath) 回调,传递2个参数，异常err 和  resolvedPath真实地址

 */
//var cache = {'/etc': '/private/etc'};
fs.realpath('./', function (err, resolvedPath) {
    if (err) throw err;
    console.log(resolvedPath);
});

/*
 删除某一个文件链接:
 fs.unlink(path, callback)
 fs.unlinkSync(path)

 参数：
 path           文件路径
 callback     回调，传递一个异常参数err。
 */


/*
 创建目录：
 fs.mkdir(path, [mode], callback)
 s.mkdirSync(path, [mode])

 参数：
 path  将创建的目录路径
 mode  目录权限（读写权限），默认0777
 callback  回调，传递异常参数err

 删除目录：
 fs.rmdir(path, callback)
 fs.rmdirSync(path)
 参数：
 path  目录路径
 callback   回调，回调函数传递一个err异常参数。
 */
fs.mkdirSync('dir_test');
fs.rmdirSync('dir_test');

/*
 读取 path 路径所在目录的内容：
 fs.readdir(path, callback)
 fs.readdirSync(path)
 参数：
 path  目录路径
 回调函数 (callback) 接受两个参数 (err, files) 其中 files 是一个存储目录中所包含的文件名称的数组，数组中不包括 '.' 和 '..'
 */

fs.readdir('./', function () {
    console.log(arguments);
});

/*
 修改路径文件时间戳:
 fs.utimes(path, atime, mtime, callback)
 fs.utimesSync(path, atime, mtime)
 参数：
 path  文件路径
 mtime  修改时间 ，表示文件被修改的时间和日期。文件的内容发生改变时，文件的修改日期将随之更新
 atime  访问时间 ，表示文件最后被访问的时间和日期。 每一次应用程序或服务使用系统调用，读取一个文件时，文件的访问时间都会更新。
 callback  回调，传递一个异常参数err

 文件描述符所指向的文件的时间戳：
 fs.futimes(fd, atime, mtime, callback)#
 fs.futimesSync(fd, atime, mtime)
 */

/*
 同步磁盘缓存:
 fs.fsync(fd, callback)
 fs.fsyncSync(fd)
 参数：
 fd               文件描述符
 callback     回调，传递一个异常参数err
 */

/*
 fs.write() 功能与 fs.writeFile() 类似，但该方法提供更底层的操作，实际应用中建议使用多 fs.writeFile()


 通过文件标识fd，向指定的文件中写入buffer:
 fs.write(fd, buffer, offset, length[, position], callback)
 fs.writeSync(fd, buffer, offset, length[, position])

 参数：
 fd     文件描述符。
 buffer      缓冲区，数据将被写入。buffer尺寸的大小设置最好是8的倍数，效率较高。
 offset      buffer写入的偏移量
 length     （integer）   指定文件读取字节数长度
 position   （integer）   指定文件读取的起始位置，如果该项为null，将从当前文件指针的位置开始读取数据。
 callback      回调传递了三个参数，err， bytesRead， buffer
 · err  异常
 · bytesRead:读取的字节数
 · buffer:缓冲区对象

 写法将数据data写入文件（根据文件描述符fd来查找文件）。如果数据不是一个缓冲区的实例值将被强制转换为一个字符串：

 fs.write(fd, data[, position[, encoding]], callback)
 fs.writeSync(fd, data[, position[, encoding]])

 注意：fs.write多次地在同一个文件中使用而没有等待回调是不安全的。在这种情况下，强烈推荐使用fs.createWriteStream

 参数：
 encoding     字符编码
 callback
 · err            异常
 · written     指定多少字符数将被写入到文件。
 · string       返回的Buffer
 */

/*
 根据指定的文件描述符fd来读取文件数据并写入buffer指向的缓冲区对象。相对于readFile提供了更底层的接口。
 一般情况下不建议使用这种方式来读取文件，因为它要求你手动管理缓冲区和文件指针，尤其是在
 你不知道文件大小的时候，这将会是一件很麻烦的事情。

 fs.read(fd, buffer, offset, length, position, callback)
 fs.readSync(fd, buffer, offset, length, position)

 参数：
 fs          文件描述符
 buffer      缓冲区，数据将被写入。
 offset      buffer写入的偏移量
 length     （integer）   指定文件读取字节数长度
 position   （integer）   指定文件读取的起始位置，如果该项为null，将从当前文件指针的位置开始读取数据。
 callback    回调传递了三个参数，err， bytesRead， buffer
 · err  异常
 · bytesRead:读取的字节数
 · buffer:缓冲区对象
 */

/*
 异步读取一个文件的全部内容:
 不设置内容编码的情况下，将以buffer的格式输出，如：<Buffer 32 33 31 32 33 31 32 33 31 32 33>
 fs.readFile(filename, [options], callback)
 fs.readFileSync(filename, [options])

 参数：
 filename    文件路径
 options      option对象，包含 encoding，编码格式，该项是可选的。
 callback      回调，传递2个参数 异常err 和 文件内容 data
 */
fs.readFile('./readFile.txt', function (err, data) {
    if (err) throw err;
    console.log(data);
});
console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
console.log(fs.readFileSync('./readFile.txt', 'utf-8'));

/*
 将data写入文件，文件已存在的情况下，原内容将被替换:
 fs.writeFile(filename, data, [options], callback)
 fs.writeFileSync(filename, data, [options])

 参数：
 filename     (String)           文件名称
 data         (String | Buffer)  将要写入的内容，可以使字符串 或 buffer数据。
 options      (Object)           option数组对象，包含：
 · encoding   (string)           可选值，默认 ‘utf8′，当data使buffer时，该值应该为 ignored。
 · mode       (Number)           文件读写权限，默认值 438
 · flag       (String)           默认值 ‘w'
 callback {Function}  回调，传递一个异常参数err。
 */
fs.writeFile('hello.txt', 'HelloWorld', function (err) {
    if (err) throw err;
    console.log('It\'s saved!');
});

/*
 异步的将数据添加到一个文件的尾部，如果文件不存在，会创建一个新的文件：
 fs.appendFile(filename, data, [options], callback)
 fs.appendFileSync(filename, data, [options])

 参数：
 filename 文件名称
 data     将要写入的内容，可以是一个string，也可以是原生buffer
 options      (Object)           option数组对象，包含：
 · encoding   (string)           可选值，默认 ‘utf8′，当data使buffer时，该值应该为 ignored。
 · mode       (Number)           文件读写权限，默认值 438
 · flag       (String)           默认值 ‘w'
 callback {Function}  回调，传递一个异常参数err。
 */

fs.appendFile('hello.txt', '\ndata to append', function (err) {
    if (err) throw err;
    console.log('The "data to append" was appended to file!'); //数据被添加到文件的尾部
});

/*
 观察指定路径的改变。改函数返回的对象是 fs.FSWatcher:
 fs.watch(filename, [options], [listener])

 参数:
 filename: 文件或者目录
 options: 可选,如果 options 选项被提供那么它应当是一个只包含成员persistent得对象，
 persistent为boolean类型。persistent指定了进程是否“只要文件被监视就继续执行”缺省值为 { persistent: true }.

 listener(event, filename):  event 是 'rename'（重命名）或者 'change'（改变），而 filename 则是触发事件的文件名。

 注意：fs.watch 不是完全跨平台的，且在某些情况下不可用。

 可用性：此功能依赖于操作系统底层提供的方法来监视文件系统的变化。
 1、在 Linux 操作系统上，使用 inotify。
 2、在 BSD 操作系统上 (包括 OS X)，使用 kqueue。
 3、在 SunOS 操作系统上 (包括 Solaris 和 SmartOS)，使用 event ports。
 4、在 Windows 操作系统上，该特性依赖于 ReadDirectoryChangesW。

 如果系统底层函数出于某些原因不可用，那么 fs.watch 也就无法工作。例如，监视网络文件系统(如 NFS, SMB 等)
 的文件或者目录，就时常不能稳定的工作，有时甚至完全不起作用。
 不过你仍然可以调用使用了文件状态调查的 fs.watchFile，但是会比较慢而且比较不可靠。

 注意：在回调函数中提供的 filename 参数不是在每一个操作系统中都被支持（当下仅在Linux和Windows上支持）。
 即便是在支持的系统中，filename也不能保证在每一次回调都被提供。因此，不要假设filename参数总会会在
 回调函数中提供，在回调函数中添加检测filename是否为null的if判断语句。
 */
// 比如：
fs.watch('hello.txt', function (event, filename) {
    console.log('event is: ' + event);
    if (filename) {
        console.log('filename provided: ' + filename);
    } else {
        console.log('filename not provided');
    }
});

/*
 监视filename指定的文件的改变：
 fs.watchFile(filename, [options], listener)

 参数：
 options   可选，options 应该是包含两个成员persistent和interval的对象，其中persistent值为boolean类型。
 persistent指定进程是否应该在文件被监视（watch）时继续运行，interval指定了目标文件被查询的间隔，以毫秒为单位。
 缺省值为{ persistent: true, interval: 5007 }。

 listener  listener 会在文件每一次被访问时被调用，listener 有两个参数，第一个为文件现在的状态，第二个为文件的前一个状态

 注意：
 如果你只想在文件被修改时被告知，而不是仅仅在被访问时就告知，你应当在listener回调函数中比较下两个状态对象的mtime属性。
 即curr.mtime 和 prev.mtime.

 */

/*
 fs.watch和fs.watchFile的区别：

 他们俩个都是用来监视文件变动的（包括内容改动和名字、时间戳等的任何变化）
 在官方文档两个方法都标注“Unstable”。

 ###watchFile()

 相对稳定一些的是watchFile()这个方法，文档中介绍原理是轮询（每隔一個固定的时间去检查文件是否改动）。而且这个时间间隔是可以通过参数设置的。

 ###watch()

 watch()这个方法是通过监听操作系统提供的各种“事件”（内核发布的消息）实现的。这个不同的平台实现的细节不一致，
 导致这个方法不能保证在所有平台上可用（而且经过实验发现在Mac上行为不正常，内容的改动只能触发一次回调，再改动watch()就没动静了）。

 ###建议

 如果真正需要使用这个功能，优先试用watch()，如果在你的目标平台上无法正常使用，再考虑使用watchFile()，不过要小心千万不要用watchFile()监视太多文件，会导致内存暴涨。
 另外，watch()在Mac上的问题，我找到了解决办法，稍后分享（在watch触发的回调中，隔1s重新调用FSWatcher的start方法）
 如果不是及特殊需求，尽量使用现有的封装库，例如 gaze
 */


/*
 fs.unwatchFile(filename, [listener])
 停止监视文件名为 filename的文件.
 如果 listener 参数被指定, 会移除在fs.watchFile函数中指定的那一个listener回调函数。
 否则, 所有的回调函数都会被移除，你将彻底停止监视filename文件。

 注意：调用 fs.unwatchFile() 时，传递的文件名为未被监视的文件时，不会发生错误，而会发生一个no-op。
 */

/*
 检查指定路径的文件或者目录是否存在:
 fs.exists(path, callback)
 fs.existsSync(path)
 */
fs.exists('hello.txt', function (exists) {
    console.log(exists ? "存在" : "不存在");
});