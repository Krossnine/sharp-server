import React, {useEffect, useState } from 'react';
import { Alert, Image as BootstrapImage } from 'react-bootstrap';

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
                    <BootstrapImage
                        alt=""
                        src={imageProps.url}
                        onError={onImageError}
                        fluid={true}
                        thumbnail={true}
                    />
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
