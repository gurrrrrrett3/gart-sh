export default function htmlifyImage(image: string): string {
    // center the image
    return `<img src="${image}" style="display: block; margin-left: auto; margin-right: auto;"/><style>img { max-width: 100%; } body {background-color: black;}</style>`;
}