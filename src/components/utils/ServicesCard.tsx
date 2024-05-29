import React from 'react';
import ServicesItem from "../../obj/ServicesItem.tsx";


const ServiceCard: React.FC<ServicesItem> = ({ name, color, icon, description }) => {

    return (
        <div className="w-full my-5 sm:mb-0 sm:w-1/2">
            <div className={`relative h-full ml-0 mr-0 sm:mr-10 rounded-lg`}
            >
                <span className={`absolute top-0 left-0 w-full h-full mt-1 ml-1 bg-${color} rounded-lg`}></span>
                <div className={`relative h-full p-5 bg-white border-2 hover:mt-0.5 hover:ml-0.5 border-${color} rounded-lg`}>
                    <div className="flex items-center -mt-1">
                        {icon && <img src={icon} alt={`${name} icon`} className="w-6 h-6"/>}
                        <h3 className="my-2 ml-3 text-lg font-bold text-gray-800">{name}</h3>
                    </div>
                    <p className={`mt-2 mb-1 text-xs font-medium text-${color} uppercase`}>------------</p>
                    <p className="mb-2 text-gray-600">{description}</p>
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;
