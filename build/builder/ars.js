/**
 * Created by leoriccao on 2017/8/3.
 */
const http=require('http');
const operator=process.argv.slice(2)[0]||"leoriccao";
const changesets = require('diff-json');
const webpack_manifest_old="/data/imgcache/htdocs/staticbeta.kdmp.qq.com/webpack-manifest-old.json";
const webpack_maniafest="/data/imgcache/htdocs/staticbeta.kdmp.qq.com/static/webpack-manifest.json";
const srcdir="/data/imgcache/htdocs/staticbeta.kdmp.qq.com/static";
const fs = require('fs');
let newFileList;
const path = require('path');
const qs = require("querystring");
let oldFileList;

async function buildArs() {
    try {
        newFileList = await getnewFileList();
        oldFileList = await getoldFileList();
        let diffs=changesets.diff(newFileList,oldFileList);
        let files=[];
        diffs.forEach(function (item) {
            let filepath=path.resolve(srcdir,item.value);
            //删除后缀?
            filepath=filepath.split("?")[0];
            let relesefile="1-2296-955:339:407-"+filepath;
            files.push(relesefile);
        })
        if(files.length) {
            let arsreleaseData = files.join(";");

            var options = {
                "method": "POST",
                "hostname": "ars.sng.local",
                "port": null,
                "path": "/arsphp/daemon/releaseapi.php?model=releaseupdate",
                "headers": {
                    "content-type": "application/x-www-form-urlencoded",
                    "cache-control": "no-cache"
                }
            };

            var req = http.request(options, function (res) {
                var chunks = [];

                res.on("data", function (chunk) {
                    chunks.push(chunk);
                });

                res.on("end", function () {
                    var body = Buffer.concat(chunks);
                    console.log(body.toString());
                });
            });

            req.on('error', function (e) {
                console.error(`problem with request: ${e.message}`);
            });

            console.log(operator);

            req.write(qs.stringify({
                version_tag: 'v0000',
                product_id: '339',
                module_id: '407',
                build_person: operator,
                Version_category: '27',
                isTestcaseUpdate: '0',
                description: '自动发布',
                nextoperator: operator,
                ccs: 'leoriccao',
                host: '',
                codeOrigin: '0',
                versioninfo: arsreleaseData
            }));
            req.end();
        }

    }catch (e){
        console.log(e);
    }
}

function getoldFileList() {
    return new Promise(function (resolve,reject) {
        try{
            fs.readFile(webpack_manifest_old,function (err, data) {
                if(err){
                    throw  err
                }
                oldFileList=JSON.parse(data);
                resolve(oldFileList);
            });
        }catch (e){
            reject(e);
        }
    })
}

function getnewFileList() {
    return new Promise(function (resolve,reject) {
        try{
            fs.readFile(webpack_maniafest,function (err, data) {
                if(err){
                    throw  err
                }
                newFileList=JSON.parse(data);
                resolve(newFileList);
            });
        }catch (e){
            reject(e);
        }
    })
}

buildArs();


