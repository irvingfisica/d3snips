import * as fflate from 'https://cdn.skypack.dev/fflate?min';

class Lienzo {
    constructor(id, aspect = 0.56, useViewBox = true) {

        if (typeof d3 === 'undefined') {
            throw new Error("D3js no existe, carga D3 antes de usar esta clase");
        };

        this.id = id;
        this.aspect = aspect;

        this.container = d3.select("#" + id);
        if (this.container.empty()) this.container = d3.select("body").append("div").attr("id", id);

        let width = parseInt(this.container.style("width")) || 800;
        let height = width * this.aspect;

        this.margin = {top: 0, bottom: 0, right: 0, left: 0};
        this.effective_width = width - this.margin.left - this.margin.right;
        this.effective_height = height - this.margin.top - this.margin.bottom;

        this.svg = this.container.append("svg")
                    .attr("viewBox", `0 0 ${width} ${height}`)
                    .attr("preserveAspectRatio", "xMidYMid meet")
                    .style("width","100%")
                    .style("height","auto");

        this.gsvg = this.svg.append("g")
                    .attr("class", "g_svg")
                    .attr("transform",`translate(${this.margin.left},${this.margin.top})`);

        if (!useViewBox) {
            window.addEventListener("resize", () => this.resize());
            this.resize();
        }
    }

    recompute() {
        let width = parseInt(this.container.style("width")) || 800;
        let height = width * this.aspect;

        this.effective_width = width - this.margin.left - this.margin.right;
        this.effective_height = height - this.margin.top - this.margin.bottom;

        this.svg
            .attr("viewBox", `0 0 ${width} ${height}`);

        this.gsvg.attr("transform", `translate(${this.margin.left},${this.margin.top})`);
        
        return this;
    }

    resize() {
        
        let width = parseInt(this.container.style("width")) || 800;
        let height = width * this.aspect;

        this.effective_width = width - this.margin.left - this.margin.right;
        this.effective_height = height - this.margin.top - this.margin.bottom;

        this.svg
            .attr("width", width)
            .attr("height", height);

    }

    set_aspect(aspect) {
        this.aspect = aspect;
        return this.recompute();
    }

    set_margin(margin) {
        this.margin = { ...this.margin, ...margin };
        return this.recompute();
    }

    exportPNG(filename = "chart.png", width = null, height = null) {
        const svgNode = this.svg.node();
        const svgClone = svgNode.cloneNode(true);

        // si no hay width, usar el del container (o fallback 800)
        width = width || parseInt(this.container.style("width")) || 800;
        // si no hay height, usar aspect
        height = height || width * this.aspect;

        svgClone.setAttribute("width", width);
        svgClone.setAttribute("height", height);

        const svgString = new XMLSerializer().serializeToString(svgClone);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const img = new Image();
        const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);

        img.onload = function() {
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0);
            URL.revokeObjectURL(url);

            const a = document.createElement("a");
            a.download = filename;
            a.href = canvas.toDataURL("image/png");
            a.click();
        };
        img.src = url;
    }

    exportSVG(filename = "chart.svg", width = null, height = null) {
        const svgNode = this.svg.node();
        const svgClone = svgNode.cloneNode(true);

        width = width || parseInt(this.container.style("width")) || 800;
        height = height || width * this.aspect;

        svgClone.setAttribute("width", width);
        svgClone.setAttribute("height", height);

        const svgString = new XMLSerializer().serializeToString(svgClone);
        const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();

        URL.revokeObjectURL(url);
    }

}


function fflprocess(buffer) {
    let textoU8 = fflate.decompressSync(new Uint8Array(buffer));
    let datos = JSON.parse(fflate.strFromU8(textoU8));

    return datos
}

export {Lienzo};
export {fflprocess};