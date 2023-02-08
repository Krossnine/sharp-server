import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {Col, Row, Form, ListGroup} from 'react-bootstrap';
import {ImageClient, ImageTransformOptions} from '@sharp-server/image-api-client';
import Image from "../image/Image";
import styles from "./ImageForm.module.css"

const defaultValues = {
    url: "https://images.pexels.com/photos/462162/pexels-photo-462162.jpeg",
    flip: false,
    flop: false,
    format: 'avif',
    rotate: 0,
    width: "400",
    height: "400",
};

export default function ImageForm() {
    const [compressedUrl, setCompressedUrl] = useState('');
    const [url, setUrl] = useState('');
    const [originalUrl, setOriginalUrl] = useState('');
    const {register, watch, getValues} = useForm<ImageTransformOptions>({defaultValues});

    const isDev = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development');
    const apiUrl = isDev ? 'http://localhost:3000' : window.location.origin ;
    const imageClient = new ImageClient(apiUrl);

    function refreshImage(): void {
        setUrl('');
        setOriginalUrl('');
        setOriginalUrl(getValues().url);
        setCompressedUrl(imageClient.getCompressedImageUrl(getValues()));
        setUrl(imageClient.getImageUrl(getValues()));
    }

    /* eslint-disable */
    React.useEffect(() => {
        refreshImage();
        const subscription = watch(refreshImage);
        return () => subscription.unsubscribe();
    }, [watch]);
    /* eslint-enable */

    return (
        <>
            <div id={styles.imageFormContainer}>
                <Form onSubmit={refreshImage}>
                    <Row className="mb-3">
                        <Form.Group>
                            <Form.Label>Image url</Form.Label>
                            <Form.Control {...register("url")}/>
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group as={Col}>
                            <Form.Label>Width</Form.Label>
                            <Form.Control {...register("width")} />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Height</Form.Label>
                            <Form.Control {...register("height")} />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Quality</Form.Label>
                            <Form.Control {...register("quality")} />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Format</Form.Label>
                            <Form.Select aria-label="Image format" {...register("format")}>
                                <option value="avif">Avif</option>
                                <option value="webp">Webp</option>
                                <option value="jpeg">Jpeg</option>
                                <option value="png">Png</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Rotate</Form.Label>
                            <Form.Control {...register("rotate")} />
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group as={Col}>
                            <Form.Check inline type="checkbox" label="Flip" {...register("flip")} />
                            <Form.Check inline type="checkbox" label="Flop" {...register("flop")} />
                        </Form.Group>
                    </Row>
                </Form>
                <hr/>
                <Row className="mb-3">
                    <Col className={styles.imageLabel}>
                        <div style={{ paddingBottom: "1rem" }} className="d-flex align-items-center justify-content-center">
                            <ListGroup horizontal>
                                <ListGroup.Item>
                                    <a target="_blank" rel="noreferrer" href={originalUrl}>Open original image</a>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <a target="_blank" rel="noreferrer" href={url}>Open resized url</a>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <a target="_blank" rel="noreferrer" href={compressedUrl}>Open compressed Resized url</a>
                                </ListGroup.Item>
                            </ListGroup>
                        </div>
                        <Image {...{url:compressedUrl}} />
                    </Col>
                </Row>
            </div>
        </>
    );
}
