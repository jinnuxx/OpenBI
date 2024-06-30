import './ContactUs.css';
import image from "../../public/contactUs.jpeg"
// import Navigation from "../components/Navigation";
// import Footer from "../components/Footer";
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import {Divider, Row, Col, Image} from 'antd';
import React, {useState} from 'react';
import {PageContainer} from "@ant-design/pro-components";


export default function ContactUs() {
    const [values, setValues] = useState({
        name: "",
        email: "",
        message: "",
    });

    const saveFormData = async () => {
        const formData = new FormData();
        formData.append('userName', values.name);
        formData.append('email', values.email);
        formData.append('content', values.message);

        // const response = await fetch('http://localhost:8101/api/email/sendToAdmin', {
        //     method: 'POST',
        //     body: formData,
        // });

        const response = await fetch('http://122.51.230.61:8101/api/email/sendToAdmin', {
            method: 'POST',
            body: formData,
        });

        if (response.status !== 200) {
            throw new Error(`Request failed: ${response.status}`);
        }
    };


    const onSubmit = async (event) => {
        event.preventDefault(); // Prevent default submission
        try {
            await saveFormData();
            alert('Your message was successfully submitted!');
            setValues({
                name: '', email: '', message: ''
            });
        } catch (e) {
            alert(`Sent failed! ${e.message}`);
        }
    }

    console.log(values);

    const set = (name) => {
        return ({target: {value}}) => {
            setValues((oldValues) => ({...oldValues, [name]: value}));
        };
    };


    return (
        <PageContainer
            ghost
            header={{
                title: 'Contact Me',
                breadcrumb: {},
                style: {textAlign: 'center'},
            }}>
            {/*<h2 style={{fontWeight: "bold", textAlign: "center"}}>Contact Us</h2>*/}
            {/*  <br />*/}

            <form onSubmit={onSubmit}>


                <Row gutter={16}>
                    <Col span={12}>
                        <div className='form-container'>
                            <div class="wrapper">
                                <div class="icon"><PersonIcon/></div>
                                <input class="input" type="text" required placeholder='Name' value={values.name}
                                       onChange={set("name")}/>
                            </div>

                            <div class="wrapper">
                                <div class="icon"><EmailIcon/></div>
                                <input class="input" type="text" required placeholder='Email' value={values.email}
                                       onChange={set("email")}/>
                            </div>

                            <div class="wrapper">
                                <textarea class="textarea" type="text" required placeholder='Message' rows={4} cols={40}
                                          value={values.message} onChange={set("message")}/>
                            </div>

                            <div class="wrapper">
                                <button class="submitButton" type="submit">Send Message</button>
                            </div>
                        </div>
                    </Col>
                    <Col span={12}>
                        <Image preview={false} style={{borderRadius: "10px", opacity: "70%"}} src={image}
                               alt="Contact Me"/>

                    </Col>
                </Row>
            </form>
        </PageContainer>
    )
}

// cilEnvelopeClosed
// cilUser
