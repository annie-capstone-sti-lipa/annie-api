/*! For license information please see 420.bundle.js.LICENSE.txt */
exports.id=420,exports.ids=[420],exports.modules={80645:(e,i)=>{i.i=function(e,i,t,n,r){var a,s,o=8*r-n-1,c=(1<<o)-1,f=c>>1,m=-7,p=t?r-1:0,h=t?-1:1,u=e[i+p];for(p+=h,a=u&(1<<-m)-1,u>>=-m,m+=o;m>0;a=256*a+e[i+p],p+=h,m-=8);for(s=a&(1<<-m)-1,a>>=-m,m+=n;m>0;s=256*s+e[i+p],p+=h,m-=8);if(0===a)a=1-f;else{if(a===c)return s?NaN:1/0*(u?-1:1);s+=Math.pow(2,n),a-=f}return(u?-1:1)*s*Math.pow(2,a-n)},i.c=function(e,i,t,n,r,a){var s,o,c,f=8*a-r-1,m=(1<<f)-1,p=m>>1,h=23===r?Math.pow(2,-24)-Math.pow(2,-77):0,u=n?0:a-1,l=n?1:-1,d=i<0||0===i&&1/i<0?1:0;for(i=Math.abs(i),isNaN(i)||i===1/0?(o=isNaN(i)?1:0,s=m):(s=Math.floor(Math.log(i)/Math.LN2),i*(c=Math.pow(2,-s))<1&&(s--,c*=2),(i+=s+p>=1?h/c:h*Math.pow(2,1-p))*c>=2&&(s++,c/=2),s+p>=m?(o=0,s=m):s+p>=1?(o=(i*c-1)*Math.pow(2,r),s+=p):(o=i*Math.pow(2,p-1)*Math.pow(2,r),s=0));r>=8;e[t+u]=255&o,u+=l,o/=256,r-=8);for(s=s<<r|o,f+=r;f>0;e[t+u]=255&s,u+=l,s/=256,f-=8);e[t+u-l]|=128*d}},92420:(e,i,t)=>{"use strict";t.r(i),t.d(i,{fileTypeFromBuffer:()=>B,fileTypeFromFile:()=>F,fileTypeFromStream:()=>z,fileTypeFromTokenizer:()=>T,fileTypeStream:()=>j,supportedExtensions:()=>E,supportedMimeTypes:()=>L});var n=t(87561);async function r(e,i,t,r,a){return new Promise(((s,o)=>{n.read(e,i,t,r,a,((e,i,t)=>{e?o(e):s({bytesRead:i,buffer:t})}))}))}n.existsSync,n.createReadStream;class a extends Error{constructor(){super("End-Of-Stream")}}class s{constructor(){this.resolve=()=>null,this.reject=()=>null,this.promise=new Promise(((e,i)=>{this.reject=i,this.resolve=e}))}}class o{constructor(e){if(this.s=e,this.deferred=null,this.endOfStream=!1,this.peekQueue=[],!e.read||!e.once)throw new Error("Expected an instance of stream.Readable");this.s.once("end",(()=>this.reject(new a))),this.s.once("error",(e=>this.reject(e))),this.s.once("close",(()=>this.reject(new Error("Stream closed"))))}async peek(e,i,t){const n=await this.read(e,i,t);return this.peekQueue.push(e.subarray(i,i+n)),n}async read(e,i,t){if(0===t)return 0;if(0===this.peekQueue.length&&this.endOfStream)throw new a;let n=t,r=0;for(;this.peekQueue.length>0&&n>0;){const t=this.peekQueue.pop();if(!t)throw new Error("peekData should be defined");const a=Math.min(t.length,n);e.set(t.subarray(0,a),i+r),r+=a,n-=a,a<t.length&&this.peekQueue.push(t.subarray(a))}for(;n>0&&!this.endOfStream;){const t=Math.min(n,1048576),a=await this.readFromStream(e,i+r,t);if(r+=a,a<t)break;n-=a}return r}async readFromStream(e,i,t){const n=this.s.read(t);if(n)return e.set(n,i),n.length;{const n={buffer:e,offset:i,length:t,deferred:new s};return this.deferred=n.deferred,this.s.once("readable",(()=>{this.readDeferred(n)})),n.deferred.promise}}readDeferred(e){const i=this.s.read(e.length);i?(e.buffer.set(i,e.offset),e.deferred.resolve(i.length),this.deferred=null):this.s.once("readable",(()=>{this.readDeferred(e)}))}reject(e){this.endOfStream=!0,this.deferred&&(this.deferred.reject(e),this.deferred=null)}}var c=t(72254);class f{constructor(e){this.position=0,this.numBuffer=new Uint8Array(8),this.fileInfo=e||{}}async readToken(e,i=this.position){const t=c.Buffer.alloc(e.len);if(await this.readBuffer(t,{position:i})<e.len)throw new a;return e.get(t,0)}async peekToken(e,i=this.position){const t=c.Buffer.alloc(e.len);if(await this.peekBuffer(t,{position:i})<e.len)throw new a;return e.get(t,0)}async readNumber(e){if(await this.readBuffer(this.numBuffer,{length:e.len})<e.len)throw new a;return e.get(this.numBuffer,0)}async peekNumber(e){if(await this.peekBuffer(this.numBuffer,{length:e.len})<e.len)throw new a;return e.get(this.numBuffer,0)}async ignore(e){if(void 0!==this.fileInfo.size){const i=this.fileInfo.size-this.position;if(e>i)return this.position+=i,i}return this.position+=e,e}async close(){}normalizeOptions(e,i){if(i&&void 0!==i.position&&i.position<this.position)throw new Error("`options.position` must be equal or greater than `tokenizer.position`");return i?{mayBeLess:!0===i.mayBeLess,offset:i.offset?i.offset:0,length:i.length?i.length:e.length-(i.offset?i.offset:0),position:i.position?i.position:this.position}:{mayBeLess:!1,offset:0,length:e.length,position:this.position}}}class m extends f{constructor(e,i){super(i),this.streamReader=new o(e)}async getFileInfo(){return this.fileInfo}async readBuffer(e,i){const t=this.normalizeOptions(e,i),n=t.position-this.position;if(n>0)return await this.ignore(n),this.readBuffer(e,i);if(n<0)throw new Error("`options.position` must be equal or greater than `tokenizer.position`");if(0===t.length)return 0;const r=await this.streamReader.read(e,t.offset,t.length);if(this.position+=r,(!i||!i.mayBeLess)&&r<t.length)throw new a;return r}async peekBuffer(e,i){const t=this.normalizeOptions(e,i);let n=0;if(t.position){const i=t.position-this.position;if(i>0){const r=new Uint8Array(t.length+i);return n=await this.peekBuffer(r,{mayBeLess:t.mayBeLess}),e.set(r.subarray(i),t.offset),n-i}if(i<0)throw new Error("Cannot peek from a negative offset in a stream")}if(t.length>0){try{n=await this.streamReader.peek(e,t.offset,t.length)}catch(e){if(i&&i.mayBeLess&&e instanceof a)return 0;throw e}if(!t.mayBeLess&&n<t.length)throw new a}return n}async ignore(e){const i=Math.min(256e3,e),t=new Uint8Array(i);let n=0;for(;n<e;){const r=e-n,a=await this.readBuffer(t,{length:Math.min(i,r)});if(a<0)return a;n+=a}return n}}class p extends f{constructor(e,i){super(i),this.uint8Array=e,this.fileInfo.size=this.fileInfo.size?this.fileInfo.size:e.length}async readBuffer(e,i){if(i&&i.position){if(i.position<this.position)throw new Error("`options.position` must be equal or greater than `tokenizer.position`");this.position=i.position}const t=await this.peekBuffer(e,i);return this.position+=t,t}async peekBuffer(e,i){const t=this.normalizeOptions(e,i),n=Math.min(this.uint8Array.length-t.position,t.length);if(!t.mayBeLess&&n<t.length)throw new a;return e.set(this.uint8Array.subarray(t.position,t.position+n),t.offset),n}async close(){}}class h extends f{constructor(e,i){super(i),this.fd=e}async readBuffer(e,i){const t=this.normalizeOptions(e,i);this.position=t.position;const n=await r(this.fd,e,t.offset,t.length,t.position);if(this.position+=n.bytesRead,n.bytesRead<t.length&&(!i||!i.mayBeLess))throw new a;return n.bytesRead}async peekBuffer(e,i){const t=this.normalizeOptions(e,i),n=await r(this.fd,e,t.offset,t.length,t.position);if(!t.mayBeLess&&n.bytesRead<t.length)throw new a;return n.bytesRead}async close(){return async function(e){return new Promise(((i,t)=>{n.close(e,(e=>{e?t(e):i()}))}))}(this.fd)}}function u(e){return new DataView(e.buffer,e.byteOffset)}t(80645);const l={len:1,get:(e,i)=>u(e).getUint8(i),put:(e,i,t)=>(u(e).setUint8(i,t),i+1)},d={len:2,get:(e,i)=>u(e).getUint16(i,!0),put:(e,i,t)=>(u(e).setUint16(i,t,!0),i+2)},x={len:2,get:(e,i)=>u(e).getUint16(i),put:(e,i,t)=>(u(e).setUint16(i,t),i+2)},g={len:4,get:(e,i)=>u(e).getUint32(i,!0),put:(e,i,t)=>(u(e).setUint32(i,t,!0),i+4)},k={len:4,get:(e,i)=>u(e).getUint32(i),put:(e,i,t)=>(u(e).setUint32(i,t),i+4)},w={len:4,get:(e,i)=>u(e).getInt32(i),put:(e,i,t)=>(u(e).setInt32(i,t),i+4)},v={len:8,get:(e,i)=>u(e).getBigUint64(i,!0),put:(e,i,t)=>(u(e).setBigUint64(i,t,!0),i+8)};class b{constructor(e,i){this.len=e,this.encoding=i}get(e,i){return c.Buffer.from(e).toString(this.encoding,i,i+this.len)}}class y{constructor(e){this.len=e}static decode(e,i,t){let n="";for(let r=i;r<t;++r)n+=y.codePointToString(y.singleByteDecoder(e[r]));return n}static inRange(e,i,t){return i<=e&&e<=t}static codePointToString(e){return e<=65535?String.fromCharCode(e):(e-=65536,String.fromCharCode(55296+(e>>10),56320+(1023&e)))}static singleByteDecoder(e){if(y.inRange(e,0,127))return e;const i=y.windows1252[e-128];if(null===i)throw Error("invaliding encoding");return i}get(e,i=0){return y.decode(e,i,i+this.len)}}y.windows1252=[8364,129,8218,402,8222,8230,8224,8225,710,8240,352,8249,338,141,381,143,144,8216,8217,8220,8221,8226,8211,8212,732,8482,353,8250,339,157,382,376,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255];const S={get:(e,i)=>127&e[i+3]|e[i+2]<<7|e[i+1]<<14|e[i]<<21,len:4};async function z(e){const i=await function(e,i){return new m(e,i=i||{})}(e);try{return await T(i)}finally{await i.close()}}async function B(e){if(!(e instanceof Uint8Array||e instanceof ArrayBuffer))throw new TypeError(`Expected the \`input\` argument to be of type \`Uint8Array\` or \`Buffer\` or \`ArrayBuffer\`, got \`${typeof e}\``);const i=e instanceof Uint8Array?e:new Uint8Array(e);if(i?.length>1)return T(new p(i,undefined))}function M(e,i,t){t={offset:0,...t};for(const[n,r]of i.entries())if(t.mask){if(r!==(t.mask[n]&e[n+t.offset]))return!1}else if(r!==e[n+t.offset])return!1;return!0}async function T(e){try{return(new I).parse(e)}catch(e){if(!(e instanceof a))throw e}}class I{check(e,i){return M(this.buffer,e,i)}checkString(e,i){return this.check((t=e,[...t].map((e=>e.charCodeAt(0)))),i);var t}async parse(e){if(this.buffer=c.Buffer.alloc(4100),void 0===e.fileInfo.size&&(e.fileInfo.size=Number.MAX_SAFE_INTEGER),this.tokenizer=e,await e.peekBuffer(this.buffer,{length:12,mayBeLess:!0}),this.check([66,77]))return{ext:"bmp",mime:"image/bmp"};if(this.check([11,119]))return{ext:"ac3",mime:"audio/vnd.dolby.dd-raw"};if(this.check([120,1]))return{ext:"dmg",mime:"application/x-apple-diskimage"};if(this.check([77,90]))return{ext:"exe",mime:"application/x-msdownload"};if(this.check([37,33]))return await e.peekBuffer(this.buffer,{length:24,mayBeLess:!0}),this.checkString("PS-Adobe-",{offset:2})&&this.checkString(" EPSF-",{offset:14})?{ext:"eps",mime:"application/eps"}:{ext:"ps",mime:"application/postscript"};if(this.check([31,160])||this.check([31,157]))return{ext:"Z",mime:"application/x-compress"};if(this.check([239,187,191]))return this.tokenizer.ignore(3),this.parse(e);if(this.check([71,73,70]))return{ext:"gif",mime:"image/gif"};if(this.check([255,216,255]))return{ext:"jpg",mime:"image/jpeg"};if(this.check([73,73,188]))return{ext:"jxr",mime:"image/vnd.ms-photo"};if(this.check([31,139,8]))return{ext:"gz",mime:"application/gzip"};if(this.check([66,90,104]))return{ext:"bz2",mime:"application/x-bzip2"};if(this.checkString("ID3")){await e.ignore(6);const i=await e.readToken(S);return e.position+i>e.fileInfo.size?{ext:"mp3",mime:"audio/mpeg"}:(await e.ignore(i),T(e))}if(this.checkString("MP+"))return{ext:"mpc",mime:"audio/x-musepack"};if((67===this.buffer[0]||70===this.buffer[0])&&this.check([87,83],{offset:1}))return{ext:"swf",mime:"application/x-shockwave-flash"};if(this.checkString("FLIF"))return{ext:"flif",mime:"image/flif"};if(this.checkString("8BPS"))return{ext:"psd",mime:"image/vnd.adobe.photoshop"};if(this.checkString("WEBP",{offset:8}))return{ext:"webp",mime:"image/webp"};if(this.checkString("MPCK"))return{ext:"mpc",mime:"audio/x-musepack"};if(this.checkString("FORM"))return{ext:"aif",mime:"audio/aiff"};if(this.checkString("icns",{offset:0}))return{ext:"icns",mime:"image/icns"};if(this.check([80,75,3,4])){try{for(;e.position+30<e.fileInfo.size;){await e.readBuffer(this.buffer,{length:30});const t={compressedSize:this.buffer.readUInt32LE(18),uncompressedSize:this.buffer.readUInt32LE(22),filenameLength:this.buffer.readUInt16LE(26),extraFieldLength:this.buffer.readUInt16LE(28)};if(t.filename=await e.readToken(new b(t.filenameLength,"utf-8")),await e.ignore(t.extraFieldLength),"META-INF/mozilla.rsa"===t.filename)return{ext:"xpi",mime:"application/x-xpinstall"};if(t.filename.endsWith(".rels")||t.filename.endsWith(".xml"))switch(t.filename.split("/")[0]){case"_rels":default:break;case"word":return{ext:"docx",mime:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"};case"ppt":return{ext:"pptx",mime:"application/vnd.openxmlformats-officedocument.presentationml.presentation"};case"xl":return{ext:"xlsx",mime:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}}if(t.filename.startsWith("xl/"))return{ext:"xlsx",mime:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"};if(t.filename.startsWith("3D/")&&t.filename.endsWith(".model"))return{ext:"3mf",mime:"model/3mf"};if("mimetype"===t.filename&&t.compressedSize===t.uncompressedSize){let n=await e.readToken(new b(t.compressedSize,"utf-8"));switch(n=n.trim(),n){case"application/epub+zip":return{ext:"epub",mime:"application/epub+zip"};case"application/vnd.oasis.opendocument.text":return{ext:"odt",mime:"application/vnd.oasis.opendocument.text"};case"application/vnd.oasis.opendocument.spreadsheet":return{ext:"ods",mime:"application/vnd.oasis.opendocument.spreadsheet"};case"application/vnd.oasis.opendocument.presentation":return{ext:"odp",mime:"application/vnd.oasis.opendocument.presentation"}}}if(0===t.compressedSize){let r=-1;for(;r<0&&e.position<e.fileInfo.size;)await e.peekBuffer(this.buffer,{mayBeLess:!0}),r=this.buffer.indexOf("504B0304",0,"hex"),await e.ignore(r>=0?r:this.buffer.length)}else await e.ignore(t.compressedSize)}}catch(s){if(!(s instanceof a))throw s}return{ext:"zip",mime:"application/zip"}}if(this.checkString("OggS")){await e.ignore(28);const o=c.Buffer.alloc(8);return await e.readBuffer(o),M(o,[79,112,117,115,72,101,97,100])?{ext:"opus",mime:"audio/opus"}:M(o,[128,116,104,101,111,114,97])?{ext:"ogv",mime:"video/ogg"}:M(o,[1,118,105,100,101,111,0])?{ext:"ogm",mime:"video/ogg"}:M(o,[127,70,76,65,67])?{ext:"oga",mime:"audio/ogg"}:M(o,[83,112,101,101,120,32,32])?{ext:"spx",mime:"audio/ogg"}:M(o,[1,118,111,114,98,105,115])?{ext:"ogg",mime:"audio/ogg"}:{ext:"ogx",mime:"application/ogg"}}if(this.check([80,75])&&(3===this.buffer[2]||5===this.buffer[2]||7===this.buffer[2])&&(4===this.buffer[3]||6===this.buffer[3]||8===this.buffer[3]))return{ext:"zip",mime:"application/zip"};if(this.checkString("ftyp",{offset:4})&&0!=(96&this.buffer[8])){const f=this.buffer.toString("binary",8,12).replace("\0"," ").trim();switch(f){case"avif":case"avis":return{ext:"avif",mime:"image/avif"};case"mif1":return{ext:"heic",mime:"image/heif"};case"msf1":return{ext:"heic",mime:"image/heif-sequence"};case"heic":case"heix":return{ext:"heic",mime:"image/heic"};case"hevc":case"hevx":return{ext:"heic",mime:"image/heic-sequence"};case"qt":return{ext:"mov",mime:"video/quicktime"};case"M4V":case"M4VH":case"M4VP":return{ext:"m4v",mime:"video/x-m4v"};case"M4P":return{ext:"m4p",mime:"video/mp4"};case"M4B":return{ext:"m4b",mime:"audio/mp4"};case"M4A":return{ext:"m4a",mime:"audio/x-m4a"};case"F4V":return{ext:"f4v",mime:"video/mp4"};case"F4P":return{ext:"f4p",mime:"video/mp4"};case"F4A":return{ext:"f4a",mime:"audio/mp4"};case"F4B":return{ext:"f4b",mime:"audio/mp4"};case"crx":return{ext:"cr3",mime:"image/x-canon-cr3"};default:return f.startsWith("3g")?f.startsWith("3g2")?{ext:"3g2",mime:"video/3gpp2"}:{ext:"3gp",mime:"video/3gpp"}:{ext:"mp4",mime:"video/mp4"}}}if(this.checkString("MThd"))return{ext:"mid",mime:"audio/midi"};if(this.checkString("wOFF")&&(this.check([0,1,0,0],{offset:4})||this.checkString("OTTO",{offset:4})))return{ext:"woff",mime:"font/woff"};if(this.checkString("wOF2")&&(this.check([0,1,0,0],{offset:4})||this.checkString("OTTO",{offset:4})))return{ext:"woff2",mime:"font/woff2"};if(this.check([212,195,178,161])||this.check([161,178,195,212]))return{ext:"pcap",mime:"application/vnd.tcpdump.pcap"};if(this.checkString("DSD "))return{ext:"dsf",mime:"audio/x-dsf"};if(this.checkString("LZIP"))return{ext:"lz",mime:"application/x-lzip"};if(this.checkString("fLaC"))return{ext:"flac",mime:"audio/x-flac"};if(this.check([66,80,71,251]))return{ext:"bpg",mime:"image/bpg"};if(this.checkString("wvpk"))return{ext:"wv",mime:"audio/wavpack"};if(this.checkString("%PDF")){await e.ignore(1350);const m=10485760,p=c.Buffer.alloc(Math.min(m,e.fileInfo.size));return await e.readBuffer(p,{mayBeLess:!0}),p.includes(c.Buffer.from("AIPrivateData"))?{ext:"ai",mime:"application/postscript"}:{ext:"pdf",mime:"application/pdf"}}if(this.check([0,97,115,109]))return{ext:"wasm",mime:"application/wasm"};if(this.check([73,73])){const h=await this.readTiffHeader(!1);if(h)return h}if(this.check([77,77])){const u=await this.readTiffHeader(!0);if(u)return u}if(this.checkString("MAC "))return{ext:"ape",mime:"audio/ape"};if(this.check([26,69,223,163])){async function d(){const i=await e.peekNumber(l);let t=128,n=0;for(;0==(i&t)&&0!==t;)++n,t>>=1;const r=c.Buffer.alloc(n+1);return await e.readBuffer(r),r}async function x(){const e=await d(),i=await d();i[0]^=128>>i.length-1;const t=Math.min(6,i.length);return{id:e.readUIntBE(0,e.length),len:i.readUIntBE(i.length-t,t)}}async function g(i){for(;i>0;){const t=await x();if(17026===t.id)return(await e.readToken(new b(t.len,"utf-8"))).replace(/\00.*$/g,"");await e.ignore(t.len),--i}}const k=await x();switch(await g(k.len)){case"webm":return{ext:"webm",mime:"video/webm"};case"matroska":return{ext:"mkv",mime:"video/x-matroska"};default:return}}if(this.check([82,73,70,70])){if(this.check([65,86,73],{offset:8}))return{ext:"avi",mime:"video/vnd.avi"};if(this.check([87,65,86,69],{offset:8}))return{ext:"wav",mime:"audio/vnd.wave"};if(this.check([81,76,67,77],{offset:8}))return{ext:"qcp",mime:"audio/qcelp"}}if(this.checkString("SQLi"))return{ext:"sqlite",mime:"application/x-sqlite3"};if(this.check([78,69,83,26]))return{ext:"nes",mime:"application/x-nintendo-nes-rom"};if(this.checkString("Cr24"))return{ext:"crx",mime:"application/x-google-chrome-extension"};if(this.checkString("MSCF")||this.checkString("ISc("))return{ext:"cab",mime:"application/vnd.ms-cab-compressed"};if(this.check([237,171,238,219]))return{ext:"rpm",mime:"application/x-rpm"};if(this.check([197,208,211,198]))return{ext:"eps",mime:"application/eps"};if(this.check([40,181,47,253]))return{ext:"zst",mime:"application/zstd"};if(this.check([127,69,76,70]))return{ext:"elf",mime:"application/x-elf"};if(this.check([79,84,84,79,0]))return{ext:"otf",mime:"font/otf"};if(this.checkString("#!AMR"))return{ext:"amr",mime:"audio/amr"};if(this.checkString("{\\rtf"))return{ext:"rtf",mime:"application/rtf"};if(this.check([70,76,86,1]))return{ext:"flv",mime:"video/x-flv"};if(this.checkString("IMPM"))return{ext:"it",mime:"audio/x-it"};if(this.checkString("-lh0-",{offset:2})||this.checkString("-lh1-",{offset:2})||this.checkString("-lh2-",{offset:2})||this.checkString("-lh3-",{offset:2})||this.checkString("-lh4-",{offset:2})||this.checkString("-lh5-",{offset:2})||this.checkString("-lh6-",{offset:2})||this.checkString("-lh7-",{offset:2})||this.checkString("-lzs-",{offset:2})||this.checkString("-lz4-",{offset:2})||this.checkString("-lz5-",{offset:2})||this.checkString("-lhd-",{offset:2}))return{ext:"lzh",mime:"application/x-lzh-compressed"};if(this.check([0,0,1,186])){if(this.check([33],{offset:4,mask:[241]}))return{ext:"mpg",mime:"video/MP1S"};if(this.check([68],{offset:4,mask:[196]}))return{ext:"mpg",mime:"video/MP2P"}}if(this.checkString("ITSF"))return{ext:"chm",mime:"application/vnd.ms-htmlhelp"};if(this.check([253,55,122,88,90,0]))return{ext:"xz",mime:"application/x-xz"};if(this.checkString("<?xml "))return{ext:"xml",mime:"application/xml"};if(this.check([55,122,188,175,39,28]))return{ext:"7z",mime:"application/x-7z-compressed"};if(this.check([82,97,114,33,26,7])&&(0===this.buffer[6]||1===this.buffer[6]))return{ext:"rar",mime:"application/x-rar-compressed"};if(this.checkString("solid "))return{ext:"stl",mime:"model/stl"};if(this.checkString("BLENDER"))return{ext:"blend",mime:"application/x-blender"};if(this.checkString("!<arch>"))return await e.ignore(8),"debian-binary"===await e.readToken(new b(13,"ascii"))?{ext:"deb",mime:"application/x-deb"}:{ext:"ar",mime:"application/x-unix-archive"};if(this.check([137,80,78,71,13,10,26,10])){async function y(){return{length:await e.readToken(w),type:await e.readToken(new b(4,"binary"))}}await e.ignore(8);do{const z=await y();if(z.length<0)return;switch(z.type){case"IDAT":return{ext:"png",mime:"image/png"};case"acTL":return{ext:"apng",mime:"image/apng"};default:await e.ignore(z.length+4)}}while(e.position+8<e.fileInfo.size);return{ext:"png",mime:"image/png"}}if(this.check([65,82,82,79,87,49,0,0]))return{ext:"arrow",mime:"application/x-apache-arrow"};if(this.check([103,108,84,70,2,0,0,0]))return{ext:"glb",mime:"model/gltf-binary"};if(this.check([102,114,101,101],{offset:4})||this.check([109,100,97,116],{offset:4})||this.check([109,111,111,118],{offset:4})||this.check([119,105,100,101],{offset:4}))return{ext:"mov",mime:"video/quicktime"};if(this.check([73,73,82,79,8,0,0,0,24]))return{ext:"orf",mime:"image/x-olympus-orf"};if(this.checkString("gimp xcf "))return{ext:"xcf",mime:"image/x-xcf"};if(this.check([73,73,85,0,24,0,0,0,136,231,116,216]))return{ext:"rw2",mime:"image/x-panasonic-rw2"};if(this.check([48,38,178,117,142,102,207,17,166,217])){async function B(){const i=c.Buffer.alloc(16);return await e.readBuffer(i),{id:i,size:Number(await e.readToken(v))}}for(await e.ignore(30);e.position+24<e.fileInfo.size;){const I=await B();let j=I.size-24;if(M(I.id,[145,7,220,183,183,169,207,17,142,230,0,192,12,32,83,101])){const E=c.Buffer.alloc(16);if(j-=await e.readBuffer(E),M(E,[64,158,105,248,77,91,207,17,168,253,0,128,95,92,68,43]))return{ext:"asf",mime:"audio/x-ms-asf"};if(M(E,[192,239,25,188,77,91,207,17,168,253,0,128,95,92,68,43]))return{ext:"asf",mime:"video/x-ms-asf"};break}await e.ignore(j)}return{ext:"asf",mime:"application/vnd.ms-asf"}}if(this.check([171,75,84,88,32,49,49,187,13,10,26,10]))return{ext:"ktx",mime:"image/ktx"};if((this.check([126,16,4])||this.check([126,24,4]))&&this.check([48,77,73,69],{offset:4}))return{ext:"mie",mime:"application/x-mie"};if(this.check([39,10,0,0,0,0,0,0,0,0,0,0],{offset:2}))return{ext:"shp",mime:"application/x-esri-shape"};if(this.check([0,0,0,12,106,80,32,32,13,10,135,10]))switch(await e.ignore(20),await e.readToken(new b(4,"ascii"))){case"jp2 ":return{ext:"jp2",mime:"image/jp2"};case"jpx ":return{ext:"jpx",mime:"image/jpx"};case"jpm ":return{ext:"jpm",mime:"image/jpm"};case"mjp2":return{ext:"mj2",mime:"image/mj2"};default:return}if(this.check([255,10])||this.check([0,0,0,12,74,88,76,32,13,10,135,10]))return{ext:"jxl",mime:"image/jxl"};if(this.check([254,255]))return this.check([0,60,0,63,0,120,0,109,0,108],{offset:2})?{ext:"xml",mime:"application/xml"}:void 0;if(this.check([0,0,1,186])||this.check([0,0,1,179]))return{ext:"mpg",mime:"video/mpeg"};if(this.check([0,1,0,0,0]))return{ext:"ttf",mime:"font/ttf"};if(this.check([0,0,1,0]))return{ext:"ico",mime:"image/x-icon"};if(this.check([0,0,2,0]))return{ext:"cur",mime:"image/x-icon"};if(this.check([208,207,17,224,161,177,26,225]))return{ext:"cfb",mime:"application/x-cfb"};if(await e.peekBuffer(this.buffer,{length:Math.min(256,e.fileInfo.size),mayBeLess:!0}),this.checkString("BEGIN:")){if(this.checkString("VCARD",{offset:6}))return{ext:"vcf",mime:"text/vcard"};if(this.checkString("VCALENDAR",{offset:6}))return{ext:"ics",mime:"text/calendar"}}if(this.checkString("FUJIFILMCCD-RAW"))return{ext:"raf",mime:"image/x-fujifilm-raf"};if(this.checkString("Extended Module:"))return{ext:"xm",mime:"audio/x-xm"};if(this.checkString("Creative Voice File"))return{ext:"voc",mime:"audio/x-voc"};if(this.check([4,0,0,0])&&this.buffer.length>=16){const L=this.buffer.readUInt32LE(12);if(L>12&&this.buffer.length>=L+16)try{const F=this.buffer.slice(16,L+16).toString();if(JSON.parse(F).files)return{ext:"asar",mime:"application/x-asar"}}catch{}}if(this.check([6,14,43,52,2,5,1,1,13,1,2,1,1,2]))return{ext:"mxf",mime:"application/mxf"};if(this.checkString("SCRM",{offset:44}))return{ext:"s3m",mime:"audio/x-s3m"};if(this.check([71])&&this.check([71],{offset:188}))return{ext:"mts",mime:"video/mp2t"};if(this.check([71],{offset:4})&&this.check([71],{offset:196}))return{ext:"mts",mime:"video/mp2t"};if(this.check([66,79,79,75,77,79,66,73],{offset:60}))return{ext:"mobi",mime:"application/x-mobipocket-ebook"};if(this.check([68,73,67,77],{offset:128}))return{ext:"dcm",mime:"application/dicom"};if(this.check([76,0,0,0,1,20,2,0,0,0,0,0,192,0,0,0,0,0,0,70]))return{ext:"lnk",mime:"application/x.ms.shortcut"};if(this.check([98,111,111,107,0,0,0,0,109,97,114,107,0,0,0,0]))return{ext:"alias",mime:"application/x.apple.alias"};if(this.check([76,80],{offset:34})&&(this.check([0,0,1],{offset:8})||this.check([1,0,2],{offset:8})||this.check([2,0,2],{offset:8})))return{ext:"eot",mime:"application/vnd.ms-fontobject"};if(this.check([6,6,237,245,216,29,70,229,189,49,239,231,254,116,183,29]))return{ext:"indd",mime:"application/x-indesign"};if(await e.peekBuffer(this.buffer,{length:Math.min(512,e.fileInfo.size),mayBeLess:!0}),function(e,i=0){const t=Number.parseInt(e.toString("utf8",148,154).replace(/\0.*$/,"").trim(),8);if(Number.isNaN(t))return!1;let n=256;for(let t=i;t<i+148;t++)n+=e[t];for(let t=i+156;t<i+512;t++)n+=e[t];return t===n}(this.buffer))return{ext:"tar",mime:"application/x-tar"};if(this.check([255,254]))return this.check([60,0,63,0,120,0,109,0,108,0],{offset:2})?{ext:"xml",mime:"application/xml"}:this.check([255,14,83,0,107,0,101,0,116,0,99,0,104,0,85,0,112,0,32,0,77,0,111,0,100,0,101,0,108,0],{offset:2})?{ext:"skp",mime:"application/vnd.sketchup.skp"}:void 0;if(this.checkString("-----BEGIN PGP MESSAGE-----"))return{ext:"pgp",mime:"application/pgp-encrypted"};if(this.buffer.length>=2&&this.check([255,224],{offset:0,mask:[255,224]})){if(this.check([16],{offset:1,mask:[22]}))return this.check([8],{offset:1,mask:[8]}),{ext:"aac",mime:"audio/aac"};if(this.check([2],{offset:1,mask:[6]}))return{ext:"mp3",mime:"audio/mpeg"};if(this.check([4],{offset:1,mask:[6]}))return{ext:"mp2",mime:"audio/mpeg"};if(this.check([6],{offset:1,mask:[6]}))return{ext:"mp1",mime:"audio/mpeg"}}}async readTiffTag(e){const i=await this.tokenizer.readToken(e?x:d);switch(this.tokenizer.ignore(10),i){case 50341:return{ext:"arw",mime:"image/x-sony-arw"};case 50706:return{ext:"dng",mime:"image/x-adobe-dng"}}}async readTiffIFD(e){const i=await this.tokenizer.readToken(e?x:d);for(let t=0;t<i;++t){const i=await this.readTiffTag(e);if(i)return i}}async readTiffHeader(e){const i=(e?x:d).get(this.buffer,2),t=(e?k:g).get(this.buffer,4);if(42===i){if(t>=6){if(this.checkString("CR",{offset:8}))return{ext:"cr2",mime:"image/x-canon-cr2"};if(t>=8&&(this.check([28,0,254,0],{offset:8})||this.check([31,0,11,0],{offset:8})))return{ext:"nef",mime:"image/x-nikon-nef"}}await this.tokenizer.ignore(t);return await this.readTiffIFD(!1)||{ext:"tif",mime:"image/tiff"}}if(43===i)return{ext:"tif",mime:"image/tiff"}}}async function j(e,{sampleSize:i=4100}={}){const{default:n}=await Promise.resolve().then(t.t.bind(t,84492,19));return new Promise(((t,r)=>{e.on("error",r),e.once("readable",(()=>{(async()=>{try{const s=new n.PassThrough,o=n.pipeline?n.pipeline(e,s,(()=>{})):e.pipe(s),f=e.read(i)??e.read()??c.Buffer.alloc(0);try{const e=await B(f);s.fileType=e}catch(e){e instanceof a?s.fileType=void 0:r(e)}t(o)}catch(e){r(e)}})()}))}))}const E=new Set(["jpg","png","apng","gif","webp","flif","xcf","cr2","cr3","orf","arw","dng","nef","rw2","raf","tif","bmp","icns","jxr","psd","indd","zip","tar","rar","gz","bz2","7z","dmg","mp4","mid","mkv","webm","mov","avi","mpg","mp2","mp3","m4a","oga","ogg","ogv","opus","flac","wav","spx","amr","pdf","epub","elf","exe","swf","rtf","wasm","woff","woff2","eot","ttf","otf","ico","flv","ps","xz","sqlite","nes","crx","xpi","cab","deb","ar","rpm","Z","lz","cfb","mxf","mts","blend","bpg","docx","pptx","xlsx","3gp","3g2","jp2","jpm","jpx","mj2","aif","qcp","odt","ods","odp","xml","mobi","heic","cur","ktx","ape","wv","dcm","ics","glb","pcap","dsf","lnk","alias","voc","ac3","m4v","m4p","m4b","f4v","f4p","f4b","f4a","mie","asf","ogm","ogx","mpc","arrow","shp","aac","mp1","it","s3m","xm","ai","skp","avif","eps","lzh","pgp","asar","stl","chm","3mf","zst","jxl","vcf"]),L=new Set(["image/jpeg","image/png","image/gif","image/webp","image/flif","image/x-xcf","image/x-canon-cr2","image/x-canon-cr3","image/tiff","image/bmp","image/vnd.ms-photo","image/vnd.adobe.photoshop","application/x-indesign","application/epub+zip","application/x-xpinstall","application/vnd.oasis.opendocument.text","application/vnd.oasis.opendocument.spreadsheet","application/vnd.oasis.opendocument.presentation","application/vnd.openxmlformats-officedocument.wordprocessingml.document","application/vnd.openxmlformats-officedocument.presentationml.presentation","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","application/zip","application/x-tar","application/x-rar-compressed","application/gzip","application/x-bzip2","application/x-7z-compressed","application/x-apple-diskimage","application/x-apache-arrow","video/mp4","audio/midi","video/x-matroska","video/webm","video/quicktime","video/vnd.avi","audio/vnd.wave","audio/qcelp","audio/x-ms-asf","video/x-ms-asf","application/vnd.ms-asf","video/mpeg","video/3gpp","audio/mpeg","audio/mp4","audio/opus","video/ogg","audio/ogg","application/ogg","audio/x-flac","audio/ape","audio/wavpack","audio/amr","application/pdf","application/x-elf","application/x-msdownload","application/x-shockwave-flash","application/rtf","application/wasm","font/woff","font/woff2","application/vnd.ms-fontobject","font/ttf","font/otf","image/x-icon","video/x-flv","application/postscript","application/eps","application/x-xz","application/x-sqlite3","application/x-nintendo-nes-rom","application/x-google-chrome-extension","application/vnd.ms-cab-compressed","application/x-deb","application/x-unix-archive","application/x-rpm","application/x-compress","application/x-lzip","application/x-cfb","application/x-mie","application/mxf","video/mp2t","application/x-blender","image/bpg","image/jp2","image/jpx","image/jpm","image/mj2","audio/aiff","application/xml","application/x-mobipocket-ebook","image/heif","image/heif-sequence","image/heic","image/heic-sequence","image/icns","image/ktx","application/dicom","audio/x-musepack","text/calendar","text/vcard","model/gltf-binary","application/vnd.tcpdump.pcap","audio/x-dsf","application/x.ms.shortcut","application/x.apple.alias","audio/x-voc","audio/vnd.dolby.dd-raw","audio/x-m4a","image/apng","image/x-olympus-orf","image/x-sony-arw","image/x-adobe-dng","image/x-nikon-nef","image/x-panasonic-rw2","image/x-fujifilm-raf","video/x-m4v","video/3gpp2","application/x-esri-shape","audio/aac","audio/x-it","audio/x-s3m","audio/x-xm","video/MP1S","video/MP2P","application/vnd.sketchup.skp","image/avif","application/x-lzh-compressed","application/pgp-encrypted","application/x-asar","model/stl","application/vnd.ms-htmlhelp","model/3mf","image/jxl","application/zstd"]);async function F(e){const i=await async function(e){const i=await async function(e){return new Promise(((i,t)=>{n.stat(e,((e,n)=>{e?t(e):i(n)}))}))}(e);if(!i.isFile)throw new Error(`File not a file: ${e}`);const t=await async function(e,i){return new Promise(((i,t)=>{n.open(e,"r",((e,n)=>{e?t(e):i(n)}))}))}(e);return new h(t,{path:e,size:i.size})}(e);try{return await T(i)}finally{await i.close()}}}};