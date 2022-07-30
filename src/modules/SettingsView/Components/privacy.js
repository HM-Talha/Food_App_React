import React from 'react';
import '../Styles/settings.scss'
import { Title } from '../../../components/Fonts';
import { useHistory } from 'react-router-dom';

const Privacy = () => {
    const history = useHistory();
    return (
        <>
            <div className="settings-header-wrapper">
                <button style={{outline: 'none', border: 'none', background: 'none'}} className='mr-12px' onClick={() => history.goBack()}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="#292929" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </button>
                <Title level={2}>Privacy Policy</Title>
            </div>
            <div className='pl-24px pr-24px pt-32px'>
                <Title level={'subHeading'}>1. Introduction <br /> <br />

                    (a) Web Site Owner. Pikky Technologies Incorporated (referred to as “Pikky”, “we”, “us”, or “our”) is the owner of this website and application (the “Website”). Pikky provides a collection of resources to its registered and non-registered users related to nutrition and meals (the “Service”). Registered users can obtain recommendations as to dishes, recipes, meals and restaurants, based on the nutritional, dietary, food preferences, and other health-related information registered users provide through the Service. In addition, registered users will be able to order meals from restaurants and pay for such orders through the Service. This online privacy notice discloses Pikky’s information collection and use practices for the Website and Service, including what type of personal identifiable information is requested in order to use the Service, how the information is used, and with whom the information is shared. <br /> <br />

                    (b) Anonymous Website Visits. In general, you can visit the Website without disclosing OR revealing any personal information. Pikky does OR does not keep track of the domains from which people visit us. <br /> <br />

                    (c) Website Transactions. At times, Pikky will need personal information regarding a user. For example, to process an order or provide a subscription, Pikky may need to know a user’s name, mailing address, e-mail address and credit card details. It is our intent to inform you before we collect personal information, such as the user's name and/or address. <br /> <br />

                    2. Personal Information That May Be Collected <br /> <br />

                    (a) Identifying Information. In order to subscribe to our Service, Pikky will request a user to provide certain personal identifying information, which may include: name, address, e-mail address, telephone number, and, if applicable, credit card number. Pikky will not save credit card details until opted for it by the user in their personal browser which, we will not be liable for. This information is required in order to provide services your account. We may request additional information necessary to establish and maintain a user’s account.
                    <br /> <br />
                    (b) Information Users Provide. Users may provide information regarding food preferences, dietary restrictions or preferences, allergies, nutritional needs, or other health conditions. This is entirely voluntary and at your discretion. The quality of the recommendations and other information that Pikky provides to you as part of the Service is dependent upon the information that you provide, however.
                    <br /> <br />
                    (c) Information from Children. Pikky does not collect or maintain information from users actually known to be under the age of 18, and no part of the Website or Service is made available to anyone under the age of 18. Users must be 18 or older to use the Service.
                    <br /> <br />
                    (d) Lost or Stolen Information. If a customer's credit card number or password is lost or stolen, the customer should promptly notify us in order to enable us to cancel the lost or stolen information and to update our records with new information.
                    <br /> <br />
                    (e) Links to Other Websites. The Website may contain links to other websites. Pikky is not responsible for the privacy practices or the content of those other websites.
                    <br /> <br />
                    3. Uses Made of the Information
                    <br /> <br />
                    (a) Limited Uses Identified. Without a customer's prior consent, Pikky will not use your personal identifiable information for any purpose other than that for which it is submitted. Pikky uses personal identifiable information to provide the Service to its customers, reply to inquiries, handle complaints, provide operational notices and in program record-keeping.
                    <br /> <br />
                    (b) Marketing Uses. Unless a customer checks the opt-out option box provided on the Website at time of registering his or her account [or later on the customer’s account page], Pikky reserves the right to provide the customer with information about the Website, products and services, and related information in which the customer has indicated an interest.
                    <br /> <br />
                    (c) Stored Information Uses. Pikky stores the information provided by customers, as well as information obtained through providing the Service to customers. This information is used to optimize the Service, support customer interaction with the Website, deliver the Service, and/or contact customers about other Pikky services and products.
                    <br /> <br />
                    (d) Online Advertising. Some companies that help Pikky deliver interactive on-line advertising, such as banner ads, may collect and use information about our customers to help us better understand the types of advertising or promotions that are most appealing to our customers. After it is collected, the information is aggregated so it is not identifiable to a specific individual. If, however, the customer would prefer that these companies not collect such information, please check the opt-out option box provided when you register for the Service [or on your account page].
                    <br /> <br />
                    4. Disclosure of the Information
                    <br /> <br />
                    (a) Within Corporate Organization. Pikky may share your personal information within the Pikky corporate organization, and may transfer the information to countries in the world where Pikky conducts business. Some countries may provide less legal protection for customer personal information. In such countries, Pikky will still handle customer personal information in the manner described herein.
                    <br /> <br />
                    (b) Mergers and Acquisitions. Circumstances may arise where for business reasons, Pikky decides to sell, buy, merge or otherwise reorganize its businesses in the United States or some other country. Such a transaction may involve the disclosure of personal identifying information to prospective or actual purchasers, and/or receiving such information from sellers. It is Pikky’s practice to seek appropriate protection for information in these types of transactions. In addition, in the event of a sale of Pikky’s business to another party, customer information will be one of the transferred assets.
                    <br /> <br />
                    (c) Agents. Pikky employs or engages other companies and individuals to perform business functions on our behalf. These persons are provided with personal identifying information required to perform their functions, but are prohibited by contract from using the information for other purposes. These persons engage in a variety of functions which include, but are not limited to, fulfilling orders, removing repetitive information from customer lists, analyzing data, providing marketing assistance, processing payments, and providing customer services.
                    <br /> <br />
                    (d) Affiliated Businesses. Pikky works closely with affiliated businesses operating website stores, providing services or selling products on each other's websites. These businesses identify themselves to customers. Customer information related to a transaction with an affiliated business is shared with that affiliated business.
                    <br /> <br />
                    (e) Marketing Analysis by Third Parties. Pikky reserves the right to disclose to third parties personal information about customers for marketing analysis; however, any information disclosed will be in the form of aggregate data that does not describe or identify an individual customer.
                    <br /> <br />
                    (f) Aggregate Information Shared with Restaurants. Pikky shares aggregate information about its users with various restaurants that Pikky has relationships with. For example, Pikky might notify a particular restaurant that a certain number of users fitting the restaurant’s desired customer profile are located within a set geographic radius (i.e., “800 vegetarian users are located within 15 miles of your restaurant”). However, Pikky does not share personal identifying information about such users with the restaurants.
                    <br /> <br />
                    (g) Disclosure to Governmental Authorities. Under certain circumstances, Pikky may release personal information to appropriate governmental authorities where release is required by law (for example, a subpoena) or by a regulation, or is requested by a government agency conducting investigations or proceedings.
                    <br /> <br />
                    5. Use of Computer Tracking Technologies
                    <br /> <br />
                    (a) Tracking of Personal Information. The Website is not set up to track, collect or distribute personal information not entered by visitors. Our site logs do generate certain kinds of non-identifying site usage data, such as the number of hits and visits to our sites. This information is used for internal purposes by technical support staff to provide better services to the public and may also be provided to others, but, again, the statistics contain no personal information and cannot be used to gather such information.
                    <br /> <br />
                    (b) Use of Cookies. Pikky, or its third-party vendors, collects non-identifiable and personal information through the use of various technologies, including "cookies". Customers may set their browsers to turn off cookies; however, the Website and Service may not then work properly.
                    <br /> <br />
                    (c) Collection of Non-Identifiable Information. Pikky may collect non-identifiable information from user visits to the Website in order to provide better customer service. Examples of such collecting include: traffic analysis, such as tracking of the domains from which users visit, or tracking numbers of visitors; measuring visitor activity on the Website; Website and system administration; user analysis; and business decision making. Pikky or its contractors may use this data to analyze trends and statistics.
                    <br /> <br />
                    (d) Collection of Personal Information. Pikky collects personal identifying information from customers during a transaction. Pikky may extract some personally identifying information about that transaction in a non-identifiable format and combine it with other non-identifiable information, such as clickstream data. This information is used and analyzed only at an aggregate level to help Pikky understand trends and patterns. This information is not reviewed at an individual level.
                    <br /> <br />
                    (e) Online Tracking. Online tracking technology enables website operators to collect personal information about consumers as they move across websites and other online services. Most browsers incorporate “do not track” (DNT) features in their privacy settings. When enabled, a DNT signal or request informs a website operator that the visitor does not wish to be tracked online. The Website is currently designed only for tracking movement within the Website. Pikky does not honor DNT requests, and does not treat visitors who make DNT requests differently from visitors who do not make DNT requests. Pikky also does not differentiate between visitors who make DNT requests and visitors who do not make such requests, when it comes to the collection or usage of personal information. There are no third parties that conduct online tracking on the Website.
                    <br /> <br />
                    6. Information Security
                    <br /> <br />
                    (a) Commitment to Online Security. Pikky employs physical, electronic and managerial procedures to safeguard the security and integrity of personal information. Billing and payment data is encrypted whenever transmitted or received online. Personal information is accessible only by staff designated to handle online requests or complaints. All Pikky agents and contractors with access to personal information on the Website or Service are also bound to adhere to Pikky security standards.
                    <br /> <br />
                    (b) Segregation of Information. Pikky uses information users provide regarding food preferences, dietary restrictions or preferences, allergies, nutritional needs, or other health conditions, in order to build a profile for such user. This profile is used to make recommendations. It is our practice to store profile information in a separate database from personal identifying information about the user (such as name or email address).
                    <br /> <br />
                    (c) No Liability for Acts of Third Parties. Pikky will exercise all reasonable efforts to safeguard the confidentiality of customer personal information. However, transmissions protected by industry standard security technology and implemented by human beings cannot be made absolutely secure. Consequently, Pikky will not be liable for unauthorized disclosure of personal information due to no fault of Pikky including, but not limited to, errors in transmission and unauthorized acts of Pikky staff and/or third parties.
                    <br /> <br />
                    7. Privacy Policy Changes
                    <br /> <br />
                    Pikky reserves the right to change its privacy policy practices and statement at any time. A notice of any material change will be posted on the Website for ____ days prior to the implementation of such change.
                    <br /> <br />
                    8. Access Rights to Data
                    <br /> <br />
                    (a) Information Maintained by Pikky. Upon a customer's request, Pikky will provide a reasonable description of customer's personally identifiable information that Pikky maintains in its records. Pikky can be contacted by e-mail at [provide e-mail address].
                    <br /> <br />
                    (b) Corrections and Changes to Personal Information. If your personal information changes, or if you note an error upon review of your information that Pikky has on file, please update or correct such information on your account page should you choose to do so.
                    <br /> <br />
                    9. Accountability
                    <br /> <br />
                    If you choose to subscribe to the Service, your action is deemed acceptance of Pikky’s practices described in this policy statement. Any dispute over privacy between a customer and Pikky is subject to the provisions of this notice and to Pikky’s Terms of Service, which is incorporated herein and which can be read at [provide web site address].
                    <br /> <br />
                    10. Special Provisions for European Union Residents
                    <br /> <br />
                    The provisions in this section apply to users who are individuals residing in a European Union country (“EU Residents”). The General Data Protection Regulation, or GDPR, is a European Union regulation that governs the relationship between Pikky and EU Residents. Under the GDPR, Pikky is considered to be a “data controller.” This means that Pikky determines how and why personal data is processed.
                    In the course of providing the Service, Pikky may collect certain identifying personal data about EU Residents, including name, identification number, location data, online identifier, photographs, videos, etc. In these Terms, any such personal data that can be used to identify a specific person will be called “Personal Data.” As an EU Resident, you have the following rights, which we call Data Access Rights:
                    <br /> <br />

                    You have the right to obtain confirmation from Pikky as to whether we are processing Personal Data concerning you.
                    <br /> <br />
                    You have the right to information about the processing of your Personal Data, such as the purposes, the categories of Personal Data, recipients, etc.
                    <br /> <br />
                    You have the right to obtain a copy, in electronic format, of any Personal Data concerning you that we hold.
                    <br /> <br />
                    You have the right to be forgotten. This means that you have to right to have Pikky erase your Personal Data. You also have the right to have Pikky stop any further dissemination of your Personal Data. If Personal Data was collected when you were a minor, we are obligated to delete it upon your request. However, Pikky has the right to maintain your Personal Data in the following cases:
                    <br /> <br />
                    If the Personal Data we hold is needed to exercise the right of freedom of expression;
                    If we have a legal obligation to keep your Personal Data;
                    <br /> <br />
                    If we need to maintain your Personal Data for reasons of public interest, such as public health, scientific, statistical, or historical research purposes; or
                    If your Personal Data has undergone an appropriate process of anonymization.
                    <br /> <br />
                    You have the right to object to the processing of your Personal Data for specific reasons. In such a case, Pikky will stop processing your Personal Data unless we need to process the Personal Data for reasons that override your rights and freedoms, or if we need the data for the establishment, exercise, or defense of legal claims.
                    <br /> <br />
                    You have the right to object at any time to the processing of your Personal Data for direct marketing purposes.
                    <br /> <br />
                    To exercise any of your Data Access Rights, please contact Pikky at [email]. Please note that there is no charge for exercising any of your Data Rights. However, if we determine that requests are unfounded or excessive, in particular because of their repetitive nature, we have the right to charge a reasonable fee or refuse to act.
                    <br /> <br />
                    In addition to your Data Access Rights, the GDPR also grants you a Data Portability Right. This is the right to have us transmit your Personal Data to another organization in a structured, machine-readable format. You may exercise your Data Portability Right only where we collected your Personal Data in the context of a contract or on the basis of consent, and such data is processed by automated means. To exercise your Data Portability Right, please contact Pikky at [email].</Title>
            </div>
        </>
    );
}

export default Privacy;