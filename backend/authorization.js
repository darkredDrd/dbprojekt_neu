export function checkPermission(role, operation) {
    const permissions = {
        'Account-Manager': [
            'createOffer', 'updateOffer', 'deleteOffer', 'updateOfferStatus', 'getOffers', 'getOfferById',
            'createComment', 'updateComment', 'deleteComment', 'getComments', 'getCommentById',
            'createDocument', 'updateDocument', 'deleteDocument', 'getDocumentContent', 'getDocuments', 'getDocumentById', 'getDocumentsByOfferId',
            'createCustomer', 'updateCustomer', 'deleteCustomer', 'getCustomers', 'getCustomerById'
        ],
        'Developer': [
            'getOffers', 'getOfferById', 'updateOffer', 
            'createComment', 'updateComment', 'deleteComment',
            'createDocument', 'updateDocument', 'deleteDocument', 'getDocumentContent', 'getDocuments', 'getDocumentById', 'getDocumentsByOfferId',
            'getCustomers', 'getCustomerById',
            'importLegacyOffer', 'generateTestData'
        ],
        'User': [
            'getOffers', 'getOfferById', 
            'getComments', 'getCommentById', 'getCommentsByOfferId',
            'getDocuments', 'getDocumentById', 'getDocumentsByOfferId', 'getDocumentContent', 
            'getCustomers', 'getCustomerById'
        ]
    };

    if (role === 'Account-Manager') {
        return permissions[role].includes(operation);
    }

    if (role === 'Developer' && offerStatus === 'Draft') {
        return permissions[role].includes(operation);
    }

    if (role === 'User' || role === 'Developer') {
        return permissions[role].includes(operation);
    }

    return false;  
}