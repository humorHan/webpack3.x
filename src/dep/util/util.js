/**
 * Created by humorHan on 2017/2/27.
 */
module.exports = {
    /* 是否是微信 */
    isWeixinBrowser: function () {
        return /micromessenger/.test(navigator.userAgent.toLowerCase());
    },
    /* 是否是安卓 */
    isAndroid: function () {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/Android/i) == "android") {
            return true;
        } else {
            return false;
        }
    },
    /** 校验表单项是否符合规范
     * @param 表单对象
     */
    valedate: function (data) {
        var valHandle = {
            name: function (val) {
                var nameReg = /^[0-9]*$/;
                var chinseReg = /^[\u4E00-\u9FA5]+$/;
                var englishReg = /^[A-Za-z]+$/;

                if (val === '' || val === undefined || val === null) {
                    return {
                        status: false,
                        msg: '姓名不能为空'
                    }
                }
                if (nameReg.test(val)) {
                    return {
                        status: false,
                        msg: '请填入真实姓名'
                    }
                }
                if (chinseReg.test(val) && val.length > 4) {
                    return {
                        status: false,
                        msg: '用户名长度不能超多4位'
                    }
                }
                if (englishReg.test(val) && val.length > 10) {
                    return {
                        status: false,
                        msg: '用户名长度不能超多10位'
                    }
                }
                if (!chinseReg.test(val) && !englishReg.test(val)) {
                    return {
                        status: false,
                        msg: '请填入真实姓名'
                    }
                }

                return {
                    status: true
                }
            },
            mobile: function (val) {
                var telReg = /^1[3|4|5|6|7|8]\d{9}$/;
                if (!telReg.test(val)) {
                    return {
                        status: false,
                        msg: '手机号码格式不正确'
                    }
                }
                if (val === '') {
                    return {
                        status: false,
                        msg: '手机号码不能为空'
                    }
                }
                return {status: true}
            },
            province: function (val) {
                if (val === '' || val === 'default') {
                    return {
                        status: false,
                        msg: '省份不能为空'
                    }
                }
                return {status: true}
            },
            city: function (val) {
                if (val === '' || val === 'default') {
                    return {
                        status: false,
                        msg: '城市不能为空'
                    }
                }
                return {status: true}
            },
            agency: function (val) {
                if (val === '' || val === 'default') {
                    return {
                        status: false,
                        msg: '经销商不能为空'
                    }
                }
                return {status: true}
            },
            model: function (val) {
                if (val === '' || val === 'default') {
                    return {
                        status: false,
                        msg: '车型不能为空'
                    }
                }
                return {status: true}
            }
        };

        for (var key in data) {
            if (!valHandle[key]) {
                throw new Error('表单匹配项无法对应，请核实');
            }
            var result = valHandle[key](data[key]);
            if (!result['status']) {
                alert(result['msg']);
                return false;
            }
        }
        return true;
    },
    /* 一点分享 */
    yidianShare: function () {
        var self = this;
        try {
            var shareInfo = {
                title: document.getElementById('yidian_share_title').innerText.trim(),
                intro: document.getElementById('yidian_share_content').innerText.trim(),
                url: document.getElementById('yidian_share_url').innerText.trim(),
                imgUrl: document.getElementById('yidian_share_imageurl').innerText.trim()
            };
            if (shareInfo.title != null && shareInfo.intro != null && shareInfo.url != null && shareInfo.imgUrl != null) {
                if (shareInfo.title != '' && shareInfo.intro != '' && shareInfo.url != '' && shareInfo.imgUrl != '') {
                    if (typeof yidian != 'undefined') {
                        yidian.share(shareInfo.title, shareInfo.intro, shareInfo.url, shareInfo.imgUrl);
                    }
                    else {
                        var tmpShareInfo = {
                            imgUrl: encodeURIComponent(shareInfo.imgUrl),
                            intro: encodeURIComponent(shareInfo.intro),
                            title: encodeURIComponent(shareInfo.title),
                            url: encodeURIComponent(shareInfo.url)
                        };
                        var schemeUrl = "yidian-article://share?t=share&image=" + tmpShareInfo.imgUrl + "&desc=" + tmpShareInfo.intro + "&title=" + tmpShareInfo.title + "&url=" + tmpShareInfo.url;
                        self.openScheme(schemeUrl);
                        return schemeUrl;
                    }
                }
                else {
                    console.log('一点资讯分享功能：分享字段不全');
                    return false;
                }
            }
            else {
                console.log('一点资讯分享功能：分享字段不全');
                return false;
            }
        }
        catch (e) {
            console.log(e.message.toString());
            return false;
        }
    }
};