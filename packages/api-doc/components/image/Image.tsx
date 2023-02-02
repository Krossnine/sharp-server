import React, {useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';

type ImageProps = {
    url: string
}

export default function Image(imageProps: ImageProps) {
    const [imageError, setImageError] = useState(false);

    function onImageError() {
        setImageError(true);
    }

    useEffect(() => {
        setImageError(false);
    }, [imageProps]);

    return (
        <>
            {imageProps.url && imageProps.url.length > 0 && !imageError &&
                <a target="_blank" rel="noreferrer" href={imageProps.url}>
                    <img alt="" src={imageProps.url} onError={onImageError} />
                </a>
            }
            {imageError &&
                <Alert variant={"danger"}>
                    Invalid image
                </Alert>
            }
        </>
    );
}
