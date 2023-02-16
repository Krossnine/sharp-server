import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {Button, Col, Collapse, FloatingLabel, Form, InputGroup, Row} from 'react-bootstrap';
import {ImageClient, ImageTransformOptions} from '@sharp-server/image-api-client';
import Image from "../image/Image";
import styles from "./ImageForm.module.css"
import ColorPicker from "../color-picker/ColorPicker";
import {ArrowDownShort, ArrowUpShort} from 'react-bootstrap-icons';

const defaultValues = {
    url: "https://images.pexels.com/photos/462162/pexels-photo-462162.jpeg",
    flip: false,
    flop: false,
    format: 'webp',
    rotate: 0,
    quality: '70',
    width: "400",
    height: "400",
};

export default function ImageForm() {
    const [open, setOpen] = useState(false);
    const [encodedUrl, setEncodedUrl] = useState(false);
    const [compressedUrl, setCompressedUrl] = useState('');
    const [url, setUrl] = useState('');
    const [background, setBackground] = useState('000000')
    const [originalUrl, setOriginalUrl] = useState('');
    const {register, watch, getValues} = useForm<ImageTransformOptions>({defaultValues});

    const isDev = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development');
    const apiUrl = isDev ? 'http://localhost:3000' : window.location.origin ;
    const imageClient = new ImageClient(apiUrl);

    function openOriginalImage(): any {
        window.open(originalUrl, "_blank");
    }

    function refreshImage(): void {
        setUrl('');
        setOriginalUrl('');
        setOriginalUrl(getValues().url);

        const editImage = {
            ...getValues(),
            background: background
        };

        setCompressedUrl(imageClient.getCompressedImageUrl(editImage));
        setUrl(imageClient.getImageUrl(editImage));
    }

    function applyBackground(color?:any) {
        setBackground(color.replace('#', ''))
    }

    function toggleEncodedUrl() : any {
        setEncodedUrl(!encodedUrl)
    }

    /* eslint-disable */
    React.useEffect(() => {
        refreshImage();
        const subscription = watch(refreshImage);
        return () => subscription.unsubscribe();
    }, [watch, background]);
    /* eslint-enable */

    return (
        <>
            <div id={styles.imageFormContainer}>
                <Form onSubmit={refreshImage}>
                    <Row className="mb-3">
                        <Form.Group as={Col} sm={8}>
                            <InputGroup className="mb-9">
                                <FloatingLabel label="">
                                    <Form.Control id="url" {...register("url")}/>
                                    <Form.Label htmlFor="url">Image Url</Form.Label>
                                </FloatingLabel>
                                <Button variant="outline-secondary" onClick={openOriginalImage}>Open</Button>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group as={Col} sm={2}>
                            <FloatingLabel label="Width (px)">
                                <Form.Control id="width" type="number" {...register("width")} />
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group as={Col} sm={2}>
                            <FloatingLabel label="Height (px)">
                                <Form.Control type="number" min={1} {...register("height")} />
                            </FloatingLabel>
                        </Form.Group>
                    </Row>
                    <Collapse in={open}>
                        <div>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <FloatingLabel label="Fit">
                                        <Form.Select aria-label="Resize fit" {...register("fit")}>
                                            <option value="cover">Cover</option>
                                            <option value="contain">Contain</option>
                                            <option value="fill">Fill</option>
                                            <option value="inside">Inside</option>
                                            <option value="outside">Outside</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Form.Group>
                                {getValues().fit === 'contain' ? (
                                    <Form.Group as={Col} sm={1}>
                                         <ColorPicker onSelectedColor={applyBackground}/>
                                    </Form.Group>
                                ) : null }
                                <Form.Group as={Col}>
                                    <FloatingLabel label="Quality (%)">
                                        <Form.Control type="number" min={1} max={100} {...register("quality")} />
                                    </FloatingLabel>
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <FloatingLabel label="Format">
                                        <Form.Select aria-label="Image format" {...register("format")}>
                                            <option value="webp">Webp</option>
                                            <option value="avif">Avif</option>
                                            <option value="jpeg">Jpeg</option>
                                            <option value="png">Png</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <FloatingLabel label="Rotate (0-360°)">
                                        <Form.Control type="number" min={0} max={360} {...register("rotate")} />
                                    </FloatingLabel>
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Check inline type="switch" id="flip" label="Flip image" {...register("flip")}/>
                                    <Form.Check inline type="switch" id="flop" label="Flop image" {...register("flop")}/>
                                    <Form.Check inline type="switch" id="blur" label="Blur image" {...register("blur")}/>
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Check inline type="switch" id="encodedUrl" label="Encoded url" onChange={toggleEncodedUrl}/>
                                </Form.Group>
                            </Row>
                        </div>
                    </Collapse>
                    <div id={styles.advancedFilters}>
                        {!open ? <ArrowDownShort /> : <ArrowUpShort/>}
                        <a href="#" className="link-secondary" onClick={() => setOpen(!open)}>
                            {!open ? 'More filters' : 'Less filters'}
                        </a>
                        {!open ? <ArrowDownShort /> : <ArrowUpShort/>}
                    </div>
                </Form>
            </div>
            <Row className="mb-3">
                <Col className={styles.imageLabel}>
                    <Image {...{url:encodedUrl ? compressedUrl: url}} />
                </Col>
            </Row>
        </>
    );
}
