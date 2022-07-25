import html2Canvas from "html2canvas";
import JsPDF from "jspdf";
//下载pdf方法
export default function createPDF(id:any, title:any, before:any, after:any) {
    // 打印之前的操作
    before && typeof before == 'function' && before();
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    if (!id) {
        throw new Error('缺少selector')
    }
    let el = document.getElementById(id);
    if (!el) {
        throw new Error('未找到' + id + '对应的dom节点')
    }
    // 将当前元素的scrollTop置为0
    el.scrollTop = 0;
    html2Canvas(el, {
        allowTaint: true,
        useCORS: true,
        dpi: 120,// 图片清晰度问题    
        background: '#FFFFFF',//如果指定的div没有设置背景色会默认成黑色,这里是个坑  
    }).then(canvas => {
        //未生成pdf的html页面高度    
        let leftHeight = canvas.height;
        const a4Width = 595.28;
        const a4Height = 841.89 //A4大小，210mm x 297mm，四边各保留10mm的边距，显示区域190x277    
        //一页pdf显示html页面生成的canvas高度;    
        const a4HeightRef = Math.floor((canvas.width / a4Width) * a4Height);
        //pdf页面偏移    
        let position = 0;
        let pageData = canvas.toDataURL('image/jpeg', 1.0);
        const pdf = new JsPDF('p', 'pt', 'a4');//A4纸，纵向    
        let index = 1, canvas1 = document.createElement('canvas'), height;
        pdf.setDisplayMode('fullwidth', 'continuous', 'FullScreen');
        const pdfName = title;
        function createImpl(canvas) {
            if (leftHeight > 0) {
                index++;
                let checkCount = 0;
                if (leftHeight > a4HeightRef) {
                    let i = position + a4HeightRef
                    for (i = position + a4HeightRef; i >= position; i--) {
                        let isWrite = true;
                        for (let j = 0; j < canvas.width; j++) {
                            const c = canvas.getContext('2d').getImageData(j, i, 1, 1).data;
                            if (c[0] != 0xff || c[1] != 0xff || c[2] != 0xff) {
                                isWrite = false;
                                break
                            };
                        }
                        if (isWrite) {
                            checkCount++;
                            if (checkCount >= 10) {
                                break;
                            };
                        } else {
                            checkCount = 0;
                        }
                    }
                    height = Math.round(i - position) || Math.min(leftHeight, a4HeightRef)
                    if (height <= 0) {
                        height = a4HeightRef
                    }
                } else {
                    height = leftHeight
                }
                canvas1.width = canvas.width
                canvas1.height = height;
                const ctx = canvas1.getContext('2d')
                ctx.drawImage(canvas, 0, position, canvas.width, height, 0, 0, canvas.width, height,)
                const pageHeight = Math.round((a4Width / canvas.width) * height);
                // pdf.setPageSize(null, pageHeight)
                if (position != 0) {
                    pdf.addPage()
                }
                pdf.addImage(canvas1.toDataURL('image/jpeg', 1.0), 'JPEG', 10, 10, a4Width, (a4Width / canvas1.width) * height,)
                leftHeight -= height;
                position += height
                if (leftHeight > 0) {
                    setTimeout(createImpl, 500, canvas);
                } else {
                    pdf.save(pdfName + '.pdf')
                }
            }
        }
        //当内容未超过pdf一页显示的范围，无需分页    
        if (leftHeight < a4HeightRef) {
            pdf.addImage(pageData, 'JPEG', 0, 0, a4Width, (a4Width / canvas.width) * leftHeight)
            pdf.save(pdfName + '.pdf')
        } else {
            try {
                pdf.deletePage(0)
                setTimeout(createImpl, 500, canvas)
            }
            catch (err) {
                // console.log(err);
            }
        }
        // 打印之后的操作
        after && typeof after == 'function' && after();
    });
};
