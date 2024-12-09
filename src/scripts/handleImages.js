export const images = importAll(
    // eslint-disable-next-line no-undef
    require.context(
        "../assets/images/personas",
        false,
        /\.(png|jpe?g|svg|webp)$/,
    ),
);

function importAll(r) {
    let images = {};
    r.keys().map((item) => {
        images[
            item
                .replace("./", "")
                .replace(".png", "")
                .replaceAll("_", " ")
                .replace(".webp", "")
        ] = r(item);
    });
    return images;
}

export function indentifyImgShape(width, height) {
    const ratio = width / height;

    if (ratio < 0.7) return "vertical";
    if (ratio >= 0.7 && ratio <= 1.2) return "square";

    return "horizontal";
}

export function indentifyImgSize(shape, width, height) {
    switch (shape) {
        case "vertical":
            if (height <= 1000) return "vertical--small";
            if (height > 1000 && height <= 1300) return "vertical--medium";
            return "vertical--big";

        case "square":
            if (height <= 800) return "square--small";
            if (height > 800 && height < 1000) return "square--medium";
            return "square--big";

        case "horizontal":
            if (width < 1200) return "horizontal--small";
            if (width >= 1200 && width < 1800) return "horizontal--medium";
            return "horizontal--big";
    }
}
