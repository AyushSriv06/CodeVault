import React from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

const TestPage = () => {
    console.log("TestPage rendering (WITH HEADER & FOOTER)");
    return (
        <div>
            <Header />
            <div style={{ marginTop: '100px', color: 'purple', fontSize: '30px' }}>
                <h1>TEST PAGE WITH HEADER & FOOTER - VERIFYING</h1>
            </div>
            <Footer />
        </div>
    );
};

export default TestPage;
