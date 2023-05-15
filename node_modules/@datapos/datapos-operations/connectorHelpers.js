/**
 * @file datapos-operations/connectorHelpers.js
 * @description Connector helper functions used by project management tasks.
 * @license ISC Licensed under the ISC license, Version 2.0. See the LICENSE.md file for details.
 * @author Jonathan Terrell <terrell.jm@gmail.com>
 * @copyright 2023 Jonathan Terrell
 */

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

async function uploadConnector(grunt, context, config, dataposConnectorUploadToken, projectId) {
    const done = context.async();
    const status = await upload(grunt, config, dataposConnectorUploadToken, projectId);
    done(status);
}

/**
 * Uploads a connector to the Data Positioning platform.
 * @param {Object} grunt - The Grunt object.
 * @param {Object} config - The configuration object for the connector.
 * @param {string} dataposConnectorUploadToken - The authorization token for uploading the connector.
 * @param {string} projectId - The ID of the project where the connector should be uploaded.
 * @returns {Promise<boolean>} - A Promise that resolves to true if the connector upload is successful, otherwise false.
 */
async function upload(grunt, config, dataposConnectorUploadToken, projectId) {
    try {
        const formData = new FormData();

        // Append the configuration to the form data object as a text field.
        formData.append('configuration', JSON.stringify(config));

        // Read the description file and append contents to the form object as a text field.
        let description;
        try {
            description = grunt.file.read('src/description.md');
        } catch (error) {
            description = '';
        }
        formData.append('description', description);

        // Read the logo file and append contents to the form object as a text field.
        let logo;
        try {
            logo = grunt.file.read('src/logo.svg');
        } catch (error) {
            logo = '';
        }
        formData.append('logo', logo);

        // Loop through the 'dist' directory and append the contents of each file as a blob field.
        grunt.file.recurse('dist', (absPath, rootDir, subDir, filename) => {
            if (subDir) return;
            const contentAsBlob = new Blob([grunt.file.read(absPath)], { type: 'text/plain' });
            formData.append(filename, contentAsBlob, filename);
        });

        // Make a request to the Data Positioning endpoint to upload the connector.
        const url = `https://europe-west1-datapos-${projectId}.cloudfunctions.net/api/connectors`;
        const response = await fetch(url, { method: 'POST', headers: { Authorization: dataposConnectorUploadToken }, body: formData });
        if (!response.ok) throw new Error(await response.text());

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

module.exports = { uploadConnector };
