/*
 流
 流是一个抽象接口，被 Node 中的很多对象所实现。比如对一个 HTTP 服务器的请求是一个流，stdout 也是一个流。
 流是可读、可写或兼具两者的。所有流都是 EventEmitter 的实例。
 可以通过 require('stream') 加载 Stream 基类，其中包括了 Readable 流、Writable 流、Duplex 流和 Transform 流的基类。
 */

/*
 * 面向流消费者的 API
 * */
// 流可以是可读（Readable）或可写（Writable），或者兼具两者（Duplex）的。
// 所有流都是 EventEmitter，但它们也具有其它自定义方法和属性，取决于它们是 Readable、Writable 或 Duplex。

/*
 类: stream.Readable:
 Readable（可读）流接口是对您正在读取的数据的来源的抽象。换言之，数据出自一个 Readable 流。
 Readable 流有两种“模式”：流动模式和暂停模式。
 当处于流动模式时，数据由底层系统读出，并尽可能快地提供给您的程序；
 当处于暂停模式时，您必须明确地调用 stream.read() 来取出若干数据块。流默认处于暂停模式。

 注意：如果没有绑定 data 事件处理器，并且没有 pipe() 目标，同时流被切换到流动模式，那么数据会流失。
 */
/*
 可以通过下面几种做法切换到流动模式：
 1、添加一个 'data' 事件处理器来监听数据
 2、调用 resume() 方法来明确开启数据流
 3、调用 pipe() 方法将数据发送到一个 Writable

 通过下面其中一种做法切换回暂停模式：
 1、如果没有导流目标，调用 pause() 方法。
 2、如果有导流目标，移除所有 ['data' 事件][] 处理器、调用 unpipe() 方法移除所有导流目标

 注意：为了向后兼容考虑，移除 'data' 事件监听器并不会自动暂停流。
 同样的，当有导流目标时，调用 pause() 并不能保证流在那些目标排空并请求更多数据时维持暂停状态。
 */

/*
 事件:

 1、readable: 当一个数据块可以从流中被读出时，它会触发一个 'readable' 事件
 2、data: 监听器到一个未被明确暂停的流会将流切换到流动模式，数据会被尽可能地传递
 3、end: 在没有更多数据能够提供时被触发
 注意:end 事件在数据被完全消费之前不会被触发。这可通过切换到流动模式，或者在到达末端前不断调用 read() 来实现。

 4、close: 当底层数据源（比如，源头的文件描述符）被关闭时触发。并不是所有流都会触发这个事件
 5、error: 当数据接收时发生错误时触发
 */

/*
 方法：

 1、readable.read([size]):
 参数：
 size {Number} 可选参数，指定要读取多少数据

 返回值：{String | Buffer | null}

 read() 方法从内部缓冲区中拉取并返回若干数据。当没有更多数据可用时，它会返回 null
 若您传入了一个 size 参数，那么它会返回相当字节的数据；当 size 字节不可用时，它则返回 null
 若您没有指定 size 参数，那么它会返回内部缓冲区中的所有数据。
 该方法仅应在暂停模式时被调用。在流动模式中，该方法会被自动调用直到内部缓冲区排空

 例子：
 var readable = getReadableStreamSomehow();
 readable.on('readable', function() {
 var chunk;
 while (null !== (chunk = readable.read())) {
 console.log('得到了 %d 字节的数据', chunk.length);
 }
 });

 注意：当该方法返回了一个数据块，它同时也会触发 'data' 事件

 2、readable.setEncoding(encoding)

 参数：
 encoding {String} 要使用的编码。
 调用此函数会使得流返回指定编码的字符串而不是Buffer对象。比如，当你readable.setEncoding('utf8')
 那么输出数据会被作为UTF-8数据解析，并以字符串返回，如果你readable.setEncoding('hex')，
 那么数据会被编码成十六进制字符串格式。

 该方法能正确处理多字节字符。假如您不这么做，仅仅直接取出 Buffer 并对它们调用 buf.toString(encoding)，
 很可能会导致字节错位。因此如果您打算以字符串读取数据，请总是使用这个方法。


 3、readable.resume()

 该方法让可读流继续触发 data 事件。

 该方法会将流切换到流动模式。如果您不想从流中消费数据，但您想得到它的 end 事件，
 您可以调用 readable.resume() 来启动数据流。
 readable.resume();
 readable.on('end', function(chunk) {
 console.log('到达末端，但并未读取任何东西');  // 到达末端，但并未读取任何东西
 })


 4、readable.pause()
 该方法会使一个处于流动模式的流停止触发 data 事件，切换到非流动模式，并让后续可用数据留在内部缓冲区中。

 readable.on('data', function(chunk) {
 console.log('取得 %d 字节数据', chunk.length);
 readable.pause();
 console.log('接下来 1 秒内不会有数据');
 setTimeout(function() {
 console.log('现在数据会再次开始流动');
 readable.resume();
 }, 1000);
 })

 5、readable.pipe(destination, [options])

 参数：
 destination {Writable Stream} 写入数据的目标
 options {Object} 导流选项
 - end {Boolean} 在读取者结束时结束写入者。缺省为 true

 该方法从可读流中拉取所有数据，并写入到所提供的目标。该方法能自动控制流量以避免目标被快速读取的可读流所淹没。
 可以导流到多个目标.
 var readable = fs.createReadStream('read.txt');
 var writable = fs.createWriteStream('write.txt');
 // 所有来自 readable 的数据会被写入到 'write.txt'
 readable.pipe(writable);

 该函数返回目标流，因此您可以建立导流链：
 var r = fs.createReadStream('file.txt');
 var z = zlib.createGzip();
 var w = fs.createWriteStream('file.txt.gz');
 r.pipe(z).pipe(w);


 例如，模拟 Unix 的 cat 命令：
 process.stdin.pipe(process.stdout);



 缺省情况下当来源流触发 end 时目标的 end() 会被调用，
 所以此时 destination 不再可写。传入 { end: false } 作为 options 可以让目标流保持开启状态。

 这将让 writer 保持开启，因此最后可以写入 "Goodbye":
 reader.pipe(writer, { end: false });
 reader.on('end', function() {
 writer.end('Goodbye\n');
 });

 注意: process.stderr 和 process.stdout 在进程结束前都不会被关闭，无论是否指定选项


 6、 readable.unpipe([destination])
 参数：
 destination {Writable Stream} 可选，指定解除导流的流

 该方法会移除之前调用 pipe() 所设定的钩子，如果不指定目标，所有导流都会被移除，如果指定了目标，但并没有与之建立导流，则什么事都不会发生

 var readable = fs.createReadStream('read.txt');
 var writable = fs.createWriteStream('file.txt');
 // 来自 readable 的所有数据都会被写入 'file.txt',
 // 但仅发生在第 1 秒
 readable.pipe(writable);
 setTimeout(function() {
 console.log('停止写入到 file.txt');
 readable.unpipe(writable);
 console.log('自行关闭文件流');
 writable.end();
 }, 1000);


 7、readable.unshift(chunk)
 参数：chunk {Buffer | String} 要插回读取队列开头的数据块

 该方法在许多场景中都很有用，比如一个流正在被一个解析器消费，解析器可能需要将某些刚拉取出的数据“逆消费”回来源，
 以便流能将它传递给其它消费者
 如果您发现您需要在您的程序中频繁调用 stream.unshift(chunk)，请考虑实现一个 Transform 流。

 */

// 取出以 \n\n 分割的头部并将多余部分 unshift() 回去
// callback 以 (error, header, stream) 形式调用
var StringDecoder = require('string_decoder').StringDecoder;
function parseHeader(stream, callback) {
    stream.on('error', callback);
    stream.on('readable', onReadable);
    var decoder = new StringDecoder('utf8');
    var header = '';

    function onReadable() {
        var chunk;
        while (null !== (chunk = stream.read())) {
            var str = decoder.write(chunk);
            if (str.match(/\n\n/)) {
                // 找到头部边界
                var split = str.split(/\n\n/);
                header += split.shift();
                var remaining = split.join('\n\n');
                var buf = new Buffer(remaining, 'utf8');
                if (buf.length)
                    stream.unshift(buf);
                stream.removeListener('error', callback);
                stream.removeListener('readable', onReadable);
                // 现在可以从流中读取消息的主体了
                callback(null, header, stream);
            } else {
                // 仍在读取头部
                header += str;
            }
        }
    }
}

// 8、readable.wrap(stream)


/*
 类: stream.Writable:

 Writable（可写）流接口是对您正在写入数据至一个目标的抽象

 方法：
 1、writable.write(chunk, [encoding], [callback])
 参数：
 chunk {String | Buffer} 要写入的数据
 encoding {String} 编码，假如 chunk 是一个字符串
 callback {Function} 数据块写入后的回调  // 返回: {Boolean} 如果数据已被全部处理则 true。

 返回值表明您是否应该立即继续写入。如果数据需要滞留在内部，则它会返回 false；否则，返回 true。

 注意：返回值所表示的状态仅供参考，您【可以】在即便返回 false 的时候继续写入。
 但是，写入的数据会被滞留在内存中，所以最好不要过分地这么做。最好的做法是等待 drain 事件发生后再继续写入更多数据。

 2、事件: 'drain'
 如果一个 writable.write(chunk) 调用返回 false，那么 drain 事件则表明可以继续向流写入更多数据。

 */
// 例子:
// 向所给可写流写入 1000000 次数据。
// 注意后端压力。
function writeOneMillionTimes(writer, data, encoding, callback) {
    var i = 1000000;
    write();
    function write() {
        var ok = true;
        do {
            i -= 1;
            if (i === 0) {
                // 最后一次！
                writer.write(data, encoding, callback);
            } else {
                // 检查我们应该继续还是等待
                // 不要传递回调，因为我们还没完成。
                ok = writer.write(data, encoding);
            }
        } while (i > 0 && ok);
        if (i > 0) {
            // 不得不提前停止！
            // 一旦它排空，继续写入数据
            writer.once('drain', write);
        }
    }
}
/*
 3、writable.cork()
 强行滞留所有写入
 滞留的数据会在 .uncork() 或 .end() 调用时被写入。

 4、writable.uncork()
 写入所有 .cork() 调用之后滞留的数据

 5、writable.end([chunk], [encoding], [callback])
 参数：
 chunk {String | Buffer} 可选，要写入的数据
 encoding {String} 编码，假如 chunk 是一个字符串
 callback {Function} 可选，流结束后的回调

 当没有更多数据会被写入到流时调用此方法。如果给出，回调会被用作 finish 事件的监听器
 在调用 end() 后调用 write() 会产生错误。
 比如：
 // 写入 'hello, ' 然后以 'world!' 结束
 http.createServer(function (req, res) {
 res.write('hello, ');
 res.end('world!');
 // 现在不允许继续写入了
 });

 6、事件: 'finish'
 当 end() 方法被调用，并且所有数据已被写入到底层系统，此事件会被触发

 for (var i = 0; i < 100; i ++) {
 writer.write('hello, #' + i + '!\n');
 }
 writer.end('this is the end\n');
 write.on('finish', function() {
 console.error('已完成所有写入。');
 });

 7、事件: 'pipe'
 该事件发生于可读流的 pipe() 方法被调用并添加本可写流作为它的目标时。

 writer.on('pipe', function(src) {
 console.error('某些东西正被导流到 writer');
 assert.equal(src, reader);
 });
 reader.pipe(writer);

 8、事件: 'unpipe'
 该事件发生于可读流的 unpipe() 方法被调用并将本可写流从它的目标移除时
 writer.on('unpipe', function(src) {
 console.error('某写东西停止导流到 writer 了');
 assert.equal(src, reader);
 });
 reader.pipe(writer);
 reader.unpipe(writer);

 */

/*
 类: stream.Transform

 转换（Transform）流是一种输出由输入计算所得的双工流。它们同时实现了 Readable 和 Writable 的接口。
 比如：zlib 流，crypto 流


 面向流实现者的 API：

 无论实现任何形式的流，模式都是一样的：
 1、在您的子类中扩充适合的父类
 2、在您的构造函数中调用父类的构造函数，以确保内部的机制被正确初始化
 3、实现一个或多个特定的方法，参见下面的细节
 所扩充的类和要实现的方法取决于您要编写的流类的形式：

 使用情景                   类             要实现的方法
 只读                       Readable      _read
 只写                       Writable      _write
 读写                       Duplex        _read, _write
 操作被写入数据，然后读出结果  Transform     _transform, _flush

 注意：在您的实现代码中，十分重要的一点是绝对不要调用上文面向流消费者的 API 中所描述的方法，
 否则可能在消费您的流接口的程序中产生潜在的副作用。


 */

/*
 类: stream.Readable
 stream.Readable 是一个可被扩充的、实现了底层方法 _read(size) 的抽象类

 */

/*

 例子一:一个计数流
 这是一个 Readable 流的基本例子。它将从 1 至 1,000,000 递增地触发数字，然后结束：

 */
var Readable = require('stream').Readable;
var util = require('util');

function Counter(opt) {
    Readable.call(this, opt);

    this._max = 1000000;
    this._index = 1;
}

util.inherits(Counter, Readable);

Counter.prototype._read = function () {
    var i = this._index++;
    if (i > this._max)
        this.push(null);
    else {
        var str = '' + i;
        var buf = new Buffer(str, 'ascii');
        this.push(buf);
    }
};

/*
 例子二: SimpleProtocol v1 (Sub-optimal)
 这个有点类似上文提到的 parseHeader 函数，但它被实现成一个自定义流。同样地，请注意这个实现并未将传入数据转换成字符串。
 实际上，更好的办法是将它实现成一个 Transform 流。更好的实现详见下文。

 */

// 简易数据协议的解析器。
// “header”是一个 JSON 对象，后面紧跟 2 个 \n 字符，以及消息主体。
//
// 注意: 使用 Transform 流能更简单地实现这个功能！
// 直接使用 Readable 并不是最佳方式

var Readable = require('stream').Readable;
var util = require('util');

function SimpleProtocol(source, options) {
    if (!(this instanceof SimpleProtocol))
        return new SimpleProtocol(options);

    Readable.call(this, options);
    this._inBody = false;
    this._sawFirstCr = false;

    // source 是一个可读流，比如嵌套字或文件
    this._source = source;

    var self = this;
    source.on('end', function () {
        self.push(null);
    });

    // 当 source 可读时做点什么
    // read(0) 不会消费任何字节
    source.on('readable', function () {
        self.read(0);
    });

    this._rawHeader = [];
    this.header = null;
}

util.inherits(SimpleProtocol, Readable);

SimpleProtocol.prototype._read = function (n) {
    if (!this._inBody) {

        if (split === -1) {
            // 继续等待 \n\n
            // 暂存数据块，并再次尝试
            this._rawHeader.push(chunk);
            this.push('');
        } else {
            this._inBody = true;
            var h = chunk.slice(0, split);
            this._rawHeader.push(h);
            var header = Buffer.concat(this._rawHeader).toString();
            try {
                this.header = JSON.parse(header);
            } catch (er) {
                this.emit('error', new Error('invalid simple protocol data'));
                return;
            }
            // 现在，我们得到了一些多余的数据，所以需要 unshift 将多余的数据放回读取队列以便我们的消费者能够读取
            var b = chunk.slice(split);
            this.unshift(b);

            // 并让它们知道我们完成了头部解析。
            this.emit('header', this.header);
        }
    } else {
        // 从现在开始，仅需向我们的消费者提供数据。
        // 注意不要 push(null)，因为它表明 EOF。
        var chunk = this._source.read();
        if (chunk) this.push(chunk);
    }
};

// 用法:
// var parser = new SimpleProtocol(source);
// 现在 parser 是一个会触发 'header' 事件并提供已解析的头部的可读流。

/*

 new stream.Readable([options])
 参数：
 options {Object}
 --highWaterMark {Number} 停止从底层资源读取前内部缓冲区最多能存放的字节数。缺省为 16kb，对于 objectMode 流则是 16
 --encoding {String} 若给出，则 Buffer 会被解码成所给编码的字符串。缺省为 null
 --objectMode {Boolean} 该流是否应该表现为对象的流。意思是说 stream.read(n) 返回一个单独的对象，而不是大小为 n 的 Buffer

 注意：请确保在扩充 Readable 类的类中调用 Readable 构造函数以便缓冲设定能被正确初始化
 */

/*
 readable._read(size)   // size {Number} 异步读取的字节数

 注意：实现这个函数，但【不要】直接调用它
 这个函数【不应该】被直接调用。它应该被子类所实现，并仅被 Readable 类内部方法所调用
 该方法以下划线开头是因为它对于定义它的类是内部的，并且不应该被用户程序直接调用。但是，你应当在您的扩充类中覆盖这个方法。

 当数据可用时，调用 readable.push(chunk) 将它加入到读取队列。如果 push 返回 false，那么您应该停止读取。
 当 _read 被再次调用，您应该继续推出更多数据。

 参数 size 仅作查询。“read”调用返回数据的实现可以通过这个参数来知道应当抓取多少数据；其余与之无关的实现，
 比如 TCP 或 TLS，则可忽略这个参数，并在可用时返回数据。
 例如，没有必要“等到” size 个字节可用时才调用stream.push(chunk)。

 */

/*
 readable.push(chunk, [encoding])
 参数：
 chunk {Buffer | null | String} 推入读取队列的数据块
 encoding {String} 字符串块的编码。必须是有效的 Buffer 编码，比如 utf8 或 ascii
 返回 {Boolean} 是否应该继续推入

 注意：这个函数应该被 Readable 实现者调用，【而不是】Readable 流的消费者

 函数 _read() 不会被再次调用，直到至少调用了一次 push(chunk)

 Readable 类的工作方式是，将数据读入一个队列，当 'readable' 事件发生、调用 read() 方法时，数据会被从队列中取出

 */

// 这个 API 被设计成尽可能地灵活。比如说，您可以包装一个低级别的具备某种暂停/恢复机制和数据回调的数据源。
// 这种情况下，您可以通过这种方式包装低级别来源对象：

// source 是一个带 readStop() 和 readStart() 方法的类，
// 以及一个当有数据时会被调用的 `ondata` 成员,当数据结束时会被调用的 `onend` 成员。
function SourceWrapper(options) {
    Readable.call(this, options);

    this._source = getLowlevelSourceObject();
    var self = this;

    // 每当有数据时，我们将它推入到内部缓冲区中
    this._source.ondata = function (chunk) {
        // 如果 push() 返回 false，我们就需要暂停读取 source
        if (!self.push(chunk))
            self._source.readStop();
    };

    // 当来源结束时，我们 push 一个 `null` 块以表示 EOF
    this._source.onend = function () {
        self.push(null);
    };
}
util.inherits(SourceWrapper, Readable);
// _read 会在流想要拉取更多数据时被调用
// 本例中忽略 size 参数
SourceWrapper.prototype._read = function (size) {
    this._source.readStart();
};


/**
 * 类: stream.Writable
 *
 * stream.Writable 是一个可被扩充的、实现了底层方法 _write(chunk, encoding, callback) 的抽象类
 *
 */

/*
 new stream.Writable([options])：

 options {Object}
 --- highWaterMark {Number} write() 开始返回 false 的缓冲级别。缺省为 16kb，对于 objectMode 流则是 16
 --- decodeStrings {Boolean} 是否在传递给 _write() 前将字符串解码成 Buffer。缺省为 true

 请确保在扩充 Writable 类的类中调用构造函数以便缓冲设定能被正确初始化。


 writable._write(chunk, encoding, callback)：

 参数：
 chunk {Buffer | String} 要被写入的数据块。总会是一个 Buffer，除非 decodeStrings 选项被设定为 false。
 encoding {String} 如果数据块是字符串，则这里指定它的编码类型。如果数据块是 Buffer 则忽略此设定。
 请注意数据块总会是一个 Buffer，除非 decodeStrings 选项被明确设定为 false。
 callback {Function} 当您处理完所给数据块时调用此函数（可选地可附上一个错误参数）。

 所有 Writable 流的实现必须提供一个 _write() 方法来将数据发送到底层资源
 注意：该函数【禁止】被直接调用。它应该被子类所实现，并仅被 Writable 内部方法所调用

 如果构造函数选项中设定了 decodeStrings 标志，则 chunk 可能会是字符串而不是 Buffer，并且 encoding 表明了字符串的格式。
 这种设计是为了支持对某些字符串数据编码提供优化处理的实现。如果您没有明确地将 decodeStrings 选项设定为 false，
 那么您可以安全地忽略 encoding 参数，并假定 chunk 总是一个 Buffer。

 注意：该方法以下划线开头是因为它对于定义它的类是内部的，并且不应该被用户程序直接调用。但是，你应当在您的扩充类中覆盖这个方法。


 writable._writev(chunks, callback)：
 chunks {Array} 要写入的块。每个块都遵循这种格式：{ chunk: ..., encoding: ... }。
 callback {Function} 当您处理完所给数据块时调用此函数（可选地可附上一个错误参数）。

 注意：该函数【禁止】被直接调用。它应该被子类所实现，并仅被 Writable 内部方法所调用。
 该函数的实现完全是可选的，在大多数情况下都是不必要的。如果实现，它会被以所有滞留在写入队列中的数据块调用。

 */

/**
 * 类: stream.Duplex
 *
 * “双工”（duplex）流同时兼具可读和可写特性，比如一个 TCP 嵌套字连接
 * 值得注意的是，stream.Duplex 是一个可以像 Readable 或 Writable 一样被扩充、实现了底层方法 _read(sise) 和 _write(chunk, encoding, callback) 的抽象类。
 *
 * new stream.Duplex(options)
 */

/**
 * 类: stream.Transform
 *  “转换”（transform）流实际上是一个输出与输入存在因果关系的双工流，比如 zlib 流或 crypto 流。
 *
 *  输入和输出并无要求相同大小、相同块数或同时到达。举个例子，一个 Hash 流只会在输入结束时产生一个数据块的输出；
 *  一个 zlib 流会产生比输入小得多或大得多的输出。
 *
 *  转换类必须实现 _transform() 方法，而不是 _read() 和 _write() 方法。
 *  可选的，也可以实现 _flush() 方法。
 *
 *
 */
/*
 new stream.Transform([options]):
 参数：
 options {Object} 传递给 Writable 和 Readable 构造函数。
 请确保在扩充 Transform 类的类中调用了构造函数，以使得缓冲设定能被正确初始化

 transform._transform(chunk, encoding, callback)

 参数：
 chunk {Buffer | String} 要被转换的数据块。总是 Buffer，除非 decodeStrings 选项被设定为 false。
 encoding {String} 如果数据块是一个字符串，那么这就是它的编码类型。（数据块是 Buffer 则会忽略此参数。）
 callback {Function} 当您处理完所提供的数据块时调用此函数（可选地附上一个错误参数）。

 注意：该函数【禁止】被直接调用。它应该被子类所实现，并仅被 Transform 内部方法所调用
 所有转换流的实现都必须提供一个 _transform 方法来接受输入并产生输出

 _transform 应当承担特定 Transform 类中所有处理被写入的字节、并将它们丢给接口的可写端的职责，
 进行异步 I/O，处理其它事情等等。

 调用 transform.push(outputChunk) 0 或多次来从输入块生成输出，取决于您想从这个数据块输出多少数据。
 仅当当前数据块被完全消费时调用回调函数。注意，任何特定的输入块都有可能或可能不会产生输出。

 注意：该方法以下划线开头是因为它对于定义它的类是内部的，并且不应该被用户程序直接调用。
 但是，你应当在您的扩充类中覆盖这个方法。

 */
// 例子: SimpleProtocol 解析器 v2
// 上文的简易协议解析器例子能够很简单地使用高级别 Transform 流类实现，
// 类似于前文 parseHeader 和 SimpleProtocal v1 示例。
// 在这个示例中，输入会被导流到解析器中，而不是作为参数提供。这种做法更符合 Node 流的惯例。

var util = require('util');
var Transform = require('stream').Transform;

function SimpleProtocol(options) {
    if (!(this instanceof SimpleProtocol))
        return new SimpleProtocol(options);

    Transform.call(this, options);
    this._inBody = false;
    this._sawFirstCr = false;
    this._rawHeader = [];
    this.header = null;
}
util.inherits(SimpleProtocol, Transform);

SimpleProtocol.prototype._transform = function (chunk, encoding, done) {
    if (!this._inBody) {
        // 检查数据块是否有 \n\n
        var split = -1;
        for (var i = 0; i < chunk.length; i++) {
            if (chunk[i] === 10) { // '\n'
                if (this._sawFirstCr) {
                    split = i;
                    break;
                } else {
                    this._sawFirstCr = true;
                }
            } else {
                this._sawFirstCr = false;
            }
        }

        if (split === -1) {
            // 仍旧等待 \n\n
            // 暂存数据块并重试。
            this._rawHeader.push(chunk);
        } else {
            this._inBody = true;
            var h = chunk.slice(0, split);
            this._rawHeader.push(h);
            var header = Buffer.concat(this._rawHeader).toString();
            try {
                this.header = JSON.parse(header);
            } catch (er) {
                this.emit('error', new Error('invalid simple protocol data'));
                return;
            }
            // 并让它们知道我们完成了头部解析。
            this.emit('header', this.header);

            // 现在，由于我们获得了一些额外的数据，先触发这个。
            this.push(chunk.slice(split));
        }
    } else {
        // 之后，仅需向我们的消费者原样提供数据。
        this.push(chunk);
    }
    done();
};
// 用法:
// var parser = new SimpleProtocol();
// source.pipe(parser)
// 现在 parser 是一个会触发 'header' 并带上解析后的头部数据的可读流。

/**
 * 类: stream.PassThrough
 * 这是 Transform 流的一个简单实现，将输入的字节简单地传递给输出。
 * 它的主要用途是演示和测试，但偶尔要构建某种特殊流的时候也能派上用场。
 */


/*
 流：内部细节

 无论 Writable 或 Readable 流都会在内部分别叫做 _writableState.buffer 和 _readableState.buffer 的对象中缓冲数据。
 被缓冲的数据量取决于传递给构造函数的 highWaterMark（最高水位线）选项。

 Readable 流的滞留发生于当实现调用 stream.push(chunk) 的时候。
 如果流的消费者没有调用 stream.read()，那么数据将会一直待在内部队列，直到它被消费。
 Writable 流的滞留发生于当用户重复调用 stream.write(chunk) 即便此时 write() 返回 false 时。

 流，尤其是 pipe() 方法的初衷，是将数据的滞留量限制到一个可接受的水平，以使得不同速度的来源和目标不会淹没可用内存。

 stream.read(0)：
 在某些情景中，您可能需要触发底层可读流机制的刷新，但不真正消费任何数据。
 在这中情况下，您可以调用 stream.read(0)，它总会返回 null。

 如果内部读取缓冲低于 highWaterMark 水位线，并且流当前不在读取状态，那么调用 read(0) 会触发一个低级 _read 调用。
 虽然几乎没有必要这么做，但您可以在 Node 内部的某些地方看到它确实这么做了，尤其是在 Readable 流类的内部。

 stream.push('')：
 推入一个零字节字符串或 Buffer（当不在 对象模式 时）有一个有趣的副作用。因为它是一个对 stream.push() 的调用，
 它会结束 reading 进程。然而，它没有添加任何数据到可读缓冲中，所以没有东西可以被用户消费。

 在极少数情况下，您当时没有数据提供，但您的流的消费者（或您的代码的其它部分）会通过调用 stream.read(0)
 得知何时再次检查。在这中情况下，您可以调用 stream.push('')。

 到目前为止，这个功能唯一一个使用情景是在 tls.CryptoStream 类中，但它将在 Node v0.12 中被废弃。
 如果您发现您不得不使用 stream.push('')，请考虑另一种方式，因为几乎可以明确表明这是某种可怕的错误。

 */

/**
 * 与 Node 早期版本的兼容性    ......
 */

/**
 * 对象模式
 * 通常情况下，流只操作字符串和 Buffer。
 *处于对象模式的流除了 Buffer 和字符串外还能读出普通的 JavaScript 值
 * 一个处于对象模式的 Readable 流调用 stream.read(size) 时总会返回单个项目，无论传入什么 size 参数。
 * 一个处于对象模式的 Writable 流总是会忽略传给 stream.write(data, encoding) 的 encoding 参数。
 *
 * 特殊值 null 在对象模式流中依旧保持它的特殊性。也就说，对于对象模式的可读流，stream.read()
 * 返回 null 意味着没有更多数据，同时 stream.push(null) 会告知流数据到达末端（EOF）。
 *
 * Node 核心不存在对象模式的流，这种设计只被某些用户态流式库所使用。
 *
 * 您应该在您的流子类构造函数的选项对象中设置 objectMode。在流的过程中设置 objectMode 是不安全的。
 *
 */

/**
 *  状态对象
 *
 *  Readable 流有一个成员对象叫作 _readableState。
 *  Writable 流有一个成员对象叫作 _writableState。
 *  Duplex 流二者兼备。
 *
 *  这些对象通常不应该被子类所更改。
 *  然而，如果您有一个 Duplex 或 Transform 流，它的可读端应该是 objectMode，但可写端却又不是 objectMode，
 *  那么您可以在构造函数里明确地设定合适的状态对象的标记来达到此目的。
 *
 *  状态对象包含了其它调试您的程序的流的状态时有用的信息。读取它们是可以的，但越过构造函数的选项来更改它们是不安全的。
 *
 */

var util = require('util');
var StringDecoder = require('string_decoder').StringDecoder;
var Transform = require('stream').Transform;
util.inherits(JSONParseStream, Transform);

// 获取以 \n 分隔的 JSON 字符串数据，并丢出解析后的对象
function JSONParseStream(options) {
    if (!(this instanceof JSONParseStream))
        return new JSONParseStream(options);

    Transform.call(this, options);
    this._writableState.objectMode = false;
    this._readableState.objectMode = true;
    this._buffer = '';
    this._decoder = new StringDecoder('utf8');
}

JSONParseStream.prototype._transform = function (chunk, encoding, cb) {
    this._buffer += this._decoder.write(chunk);
    // 以新行分割
    var lines = this._buffer.split(/\r?\n/);
    // 保留最后一行被缓冲
    this._buffer = lines.pop();
    for (var l = 0; l < lines.length; l++) {
        var line = lines[l];
        try {
            var obj = JSON.parse(line);
        } catch (er) {
            this.emit('error', er);
            return;
        }
        // 推出解析后的对象到可读消费者
        this.push(obj);
    }
    cb();
};

JSONParseStream.prototype._flush = function (cb) {
    // 仅仅处理剩下的东西
    var rem = this._buffer.trim();
    if (rem) {
        try {
            var obj = JSON.parse(rem);
        } catch (er) {
            this.emit('error', er);
            return;
        }
        // 推出解析后的对象到可读消费者
        this.push(obj);
    }
    cb();
};
