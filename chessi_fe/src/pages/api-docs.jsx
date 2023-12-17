import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import data from '../../src/apis/api.json'

export default function APIdocs() {
    return (
        <div style={{height: "fit-content", backgroundColor: "white", paddingTop: "10px"}}>
            <SwaggerUI spec={data} />
        </div>
    )
}