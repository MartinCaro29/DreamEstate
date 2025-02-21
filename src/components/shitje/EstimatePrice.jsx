import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import InteractiveMap from './InteractiveMap';
import Navigation from '../landingpage/Navigation';
import FooterNav from '../landingpage/FooterNav';
import Header from '../landingpage/Header';

const EstimatePrice = () => {
    const [coords, setCoords] = useState(null);
    const [formData, setFormData] = useState({
        beds: '',
        baths: '',
        area: '',
    });
    const [properties, setProperties] = useState([]);
    const [estimates, setEstimates] = useState(null);
    const [errors, setErrors] = useState({});

    const BASE_PRICES = {
        qera: {
            basePerBed: 200,
            basePerBath: 100,
            basePerArea: 2,
        },
        blerje: {
            basePerBed: 50000,
            basePerBath: 25000,
            basePerArea: 1000,
        },
    };



    const validateForm = () => {
        const newErrors = {};

        // Beds validation
        if (!formData.beds) {
            newErrors.beds = 'Numri i Dhomave është i detyrueshëm';
        }

        // Baths validation
        if (!formData.baths) {
            newErrors.baths = 'Numri i Banjo është i detyrueshëm';
        }

        // Area validation
        if (!formData.area || formData.area <= 0) {
            newErrors.area = 'Sipërfaqja duhet të jetë një numër më i madh se 0';
        }

        if (!formData.coordX || !formData.coordY) {  // Check that both coordinates exist
            newErrors.coords = 'Klikoni vendndodhjen ne harte';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await fetch('http://localhost:5000/getAllProperties');
                const data = await response.json();
                setProperties(data.filter(prop => prop.status !== 'ne verifikim'));
            } catch (error) {
                console.error('Error fetching properties:', error);
            }
        };
        fetchProperties();
    }, []);

    const calculateBasePrice = (type) => {
        const beds = parseInt(formData.beds) || 0;
        const baths = parseInt(formData.baths) || 0;
        const area = parseInt(formData.area) || 0;

        const bases = BASE_PRICES[type];

        return (
            beds * bases.basePerBed +
            baths * bases.basePerBath +
            area * bases.basePerArea
        );
    };

    const calculateEstimate = (similarProperties, type) => {
        const beds = parseInt(formData.beds);
        const baths = parseInt(formData.baths);
        const area = parseInt(formData.area);

        const basePrice = calculateBasePrice(type);

        if (similarProperties.length === 0) {
            return {
                estimate: basePrice,
                range: {
                    low: basePrice * 0.8,
                    high: basePrice * 1.2
                },
                confidence: 0.3,
                sampleSize: 0
            };
        }

        const calculateBlendedEstimate = (property) => {
            const bedDiff = Math.abs(property.beds - beds);
            const bathDiff = Math.abs(property.baths - baths);
            const areaDiff = Math.abs(property.area - area) / area;

            const characteristicScore = (
                (1 - (bedDiff * 0.3)) *
                (1 - (bathDiff * 0.2)) *
                (1 - (areaDiff * 0.5))
            );

            const distance = calculateDistance(
                coords.coordX,
                coords.coordY,
                property.coordX,
                property.coordY
            );
            const distanceScore = 1 - (distance / 2);

            const weight = (characteristicScore * 0.95) + (distanceScore * 0.05);

            return {
                weight,
                blendedPrice: (basePrice * 0.95) + (property.price * 0.05)
            };
        };

        const blendedProperties = similarProperties.map(property => {
            const { weight, blendedPrice } = calculateBlendedEstimate(property);
            return {
                ...property,
                weight,
                weightedPrice: blendedPrice * weight
            };
        });

        const totalWeight = blendedProperties.reduce((sum, p) => sum + p.weight, 0);
        const weightedAverage = blendedProperties.reduce((sum, p) => sum + p.weightedPrice, 0) / totalWeight;

        const typeAdjustment = type === 'qera' ? 1 : (weightedAverage < 10000 ? 1000 : 1);
        const finalEstimate = weightedAverage * typeAdjustment;

        const variance = blendedProperties.reduce((sum, p) => {
            const diff = p.weightedPrice - weightedAverage;
            return sum + (diff * diff * p.weight);
        }, 0) / totalWeight;

        const stdDev = Math.sqrt(variance);
        const confidence = Math.min(
            (similarProperties.length / 10) * (totalWeight / similarProperties.length) * 0.7 + 0.3,
            1
        );

        return {
            estimate: Math.round(finalEstimate),
            range: {
                low: Math.max(0, Math.round(finalEstimate - stdDev)),
                high: Math.round(finalEstimate + stdDev)
            },
            confidence: confidence,
            sampleSize: similarProperties.length
        };
    };

    const handleEstimateCalculation = () => {

        if (!validateForm()) {
            return;
        }
        if (!coords || !properties.length || !formData.beds || !formData.baths || !formData.area) return;

        const nearbyProperties = properties.filter(property => {
            const distance = calculateDistance(
                coords.coordX,
                coords.coordY,
                property.coordX,
                property.coordY
            );
            return distance <= 2;
        });

        setEstimates({
            rental: calculateEstimate(
                nearbyProperties.filter(p => p.sell_type === 'qera'),
                'qera'
            ),
            sale: calculateEstimate(
                nearbyProperties.filter(p => p.sell_type === 'blerje'),
                'blerje'
            )
        });
    };

    const getInputStyle = (fieldName) => ({
        borderColor: errors[fieldName] ? 'red' : '#ced4da',
        backgroundColor: errors[fieldName] ? '#fff3f3' : 'white'
    });



    useEffect(() => {
        if (coords) {
            setFormData(prev => ({
                ...prev,
                coordX: coords.coordX,
                coordY: coords.coordY
            }));
            if (errors.coords) setErrors(prev => ({ ...prev, coords: null }));
        }
    }, [coords, errors]);

    return (
        <>
            <Navigation />
            <div className="w-100 form-background-estimate">
                <Container className="p-4">
                    <Row>
                        <Col md={7} className="ms-auto me-auto">
                            <Card className="p-5 shadow-md mb-5 mt-4">
                                <Header name={"Vleresoni pronen"} />
                                <Form className="mb-4 mt-4">
                                    <Row className="mb-4">
                                        <Col md={6}>
                                            <Form.Group controlId="formBeds">
                                                <Form.Label className="mb-2">Numri i Dhomave</Form.Label>
                                                <Form.Select

                                                    className={errors.beds ? "custom-select-invalid" : ""}
                                                    name="beds"
                                                    value={formData.beds}
                                                    onChange={(e) => {
                                                        setFormData({ ...formData, beds: e.target.value });
                                                        if (errors.beds) setErrors({ ...errors, beds: null });
                                                    }}

                                                    isInvalid={!!errors.beds}
                                                >
                                                    <option value="">Zgjidhni numrin e dhomave</option>
                                                    {[...Array(10)].map((_, index) => (
                                                        <option key={index} value={index + 1}>{index + 1}</option>
                                                    ))}
                                                </Form.Select>
                                                {errors.beds && <Form.Text className="text-danger">{errors.beds}</Form.Text>}
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId="formBaths">
                                                <Form.Label className="mb-2">Numri i Banjove</Form.Label>
                                                <Form.Select

                                                    name="baths"
                                                    value={formData.baths}
                                                    onChange={(e) => {
                                                        setFormData({ ...formData, baths: e.target.value });
                                                        if (errors.baths) setErrors({ ...errors, baths: null });
                                                    }}

                                                    className={errors.baths ? "custom-select-invalid" : ""}
                                                    isInvalid={!!errors.baths}

                                                >
                                                    <option value="" disabled>Zgjidhni numrin e banjove</option>
                                                    {[...Array(10)].map((_, index) => (
                                                        <option key={index} value={index + 1}>{index + 1}</option>
                                                    ))}
                                                </Form.Select>
                                                {errors.baths && <Form.Text className="text-danger">{errors.baths}</Form.Text>}
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group controlId="formArea" className="mt-3">
                                        <Form.Label className="mb-2">Sipërfaqja (m²)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="area"
                                            value={formData.area}
                                            onChange={(e) => {
                                                setFormData({ ...formData, area: e.target.value });
                                                if (errors.area) setErrors({ ...errors, area: null });
                                            }}
                                            style={getInputStyle('area')}
                                            isInvalid={!!errors.area}
                                            placeholder="Vendosni sipërfaqen"
                                        />
                                        {errors.area && <Form.Text className="text-danger">{errors.area}</Form.Text>}
                                    </Form.Group>

                                    <Form.Label className="mb-2 mt-3">Koordinatat</Form.Label>
                                    <Row>
                                        <Col>
                                            <Form.Control
                                                type="number"
                                                value={coords?.coordX || ''}
                                                readOnly
                                                placeholder="Klikoni në hartë"
                                                onChange={(e) => {
                                                    setFormData({ ...formData, coordX: e.target.value });
                                                    if (errors.coords) setErrors({ ...errors, coords: null });
                                                }}
                                                style={getInputStyle('coords')}
                                                isInvalid={!!errors.coords}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                value={coords?.coordY || ''}
                                                readOnly
                                                onChange={(e) => {
                                                    setFormData({ ...formData, coordY: e.target.value });
                                                    if (errors.coords) setErrors({ ...errors, coords: null });
                                                }}
                                                placeholder="Klikoni në hartë"
                                                style={getInputStyle('coords')}
                                                isInvalid={!!errors.coords}
                                            />
                                        </Col>
                                        {errors.coords && <Form.Text className="text-danger">{errors.coords}</Form.Text>}
                                    </Row>


                                    <Button
                                        variant="primary"
                                        onClick={handleEstimateCalculation}
                                        className="mt-3"
                                        block
                                    >
                                        Llogarit Çmimin
                                    </Button>
                                </Form>

                                {/* Display estimates */}
                                {estimates && (
                                    <div className="mt-4 mb-5">
                                        <h3>Vlerat e Llogaritura</h3>
                                        {estimates.sale && (
                                            <Card className="mt-3 p-3">
                                                <Card.Title>Vlerësimi i Çmimit të Shitjes</Card.Title>
                                                <Card.Text>
                                                    ${estimates.sale.estimate.toLocaleString()}
                                                </Card.Text>
                                            </Card>
                                        )}

                                        {estimates.rental && (
                                            <Card className="mt-3 p-3">
                                                <Card.Title>Vlerësimi i Qirasë mujore</Card.Title>
                                                <Card.Text>
                                                    ${estimates.rental.estimate.toLocaleString()}/muaj
                                                </Card.Text>
                                            </Card>
                                        )}
                                    </div>
                                )}

                                <InteractiveMap onCoordsChange={setCoords} />
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
            <FooterNav />
        </>
    );
};

export default EstimatePrice;
