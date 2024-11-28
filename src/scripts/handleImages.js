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

//images[item.replace("./", "")] = r(item);

export const images = importAll(
    // eslint-disable-next-line no-undef
    require.context("../assets/images/personas", false, /\.(png|jpe?g|svg)$/),
);
