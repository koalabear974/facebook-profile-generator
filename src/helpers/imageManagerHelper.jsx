class imageManagerHelper {
    calculateProportions(imageProportions, overlayProportions, proportions) {
        let ratio = proportions.big.bigPicture.height / proportions.big.bigPicture.width;

        let bigOverlayWidth = imageProportions.width;
        let bigOverlayHeight = bigOverlayWidth * ratio;
        let naturalBigOverlayWidth = imageProportions.naturalWidth;
        let naturalBigOverlayHeight = naturalBigOverlayWidth * ratio;

        overlayProportions.visible.bigPicture.width = bigOverlayWidth;
        overlayProportions.visible.bigPicture.height = bigOverlayHeight;
        overlayProportions.natural.bigPicture.width = naturalBigOverlayWidth;
        overlayProportions.natural.bigPicture.height = naturalBigOverlayHeight;

        ratio = bigOverlayWidth / proportions.big.bigPicture.width;
        let naturalRatio = naturalBigOverlayWidth / proportions.big.bigPicture.width;

        let smallOverlaySize = proportions.big.smallPicture.width * ratio;
        let naturalSmallOverlaySize = proportions.big.smallPicture.width * naturalRatio;

        overlayProportions.visible.smallPicture.height =
            overlayProportions.visible.smallPicture.width = smallOverlaySize;
        overlayProportions.natural.smallPicture.height =
            overlayProportions.natural.smallPicture.width = naturalSmallOverlaySize;

        let offsetWidth = proportions.big.offset.width * ratio;
        let offsetHeight = bigOverlayHeight - (proportions.big.offset.height * ratio);
        let naturalOffsetWidth = proportions.big.offset.width * naturalRatio;
        let naturalOffsetHeight = naturalBigOverlayHeight - (proportions.big.offset.height * naturalRatio);


        overlayProportions.visible.offset.left = offsetWidth;
        overlayProportions.visible.offset.top = offsetHeight;
        overlayProportions.natural.offset.left = naturalOffsetWidth;
        overlayProportions.natural.offset.top = naturalOffsetHeight;

        return overlayProportions;
    }

    defaultValues() {
        return {
            imageProportions: {
                "width": 0,
                "height": 0,
                "naturalWidth": 0,
                "naturalHeight": 0,
            },
            overlayProportions: {
                "natural": {
                    "bigPicture": {
                        "width": 0,
                        "height": 0,
                    },
                    "smallPicture": {
                        "width": 0,
                        "height": 0,
                    },
                    "offset": {
                        "left": 0,
                        "top": 0,
                    },
                },
                "visible": {
                    "bigPicture": {
                        "width": 0,
                        "height": 0,
                    },
                    "smallPicture": {
                        "width": 0,
                        "height": 0,
                    },
                    "offset": {
                        "left": 0,
                        "top": 0,
                    },
                },
            },
            proportions: {
                "small": {
                    "bigPicture": {
                        "width": 850,
                        "height": 315,
                    },
                    "smallPicture": {
                        "width": 160,
                        "height": 160,
                    },
                    "offset": {
                        "width": 20,
                        "height": 138,
                    },
                },
                "medium": {
                    "bigPicture": {
                        "width": 1024,
                        "height": 380,
                    },
                    "smallPicture": {
                        "width": 193,
                        "height": 193,
                    },
                    "offset": {
                        "width": 24,
                        "height": 167,
                    },
                },
                "big": {
                    "bigPicture": {
                        "width": 2048,
                        "height": 759,
                    },
                    "smallPicture": {
                        "width": 386,
                        "height": 386,
                    },
                    "offset": {
                        "width": 48,
                        "height": 333,
                    },
                },
            }
        };
    }

}

export default new imageManagerHelper();
