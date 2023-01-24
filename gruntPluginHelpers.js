/**
 * @author Jonathan Terrell <terrell.jm@gmail.com>
 * @copyright 2022 Jonathan Terrell
 * @file datapos-engine/src/gruntPluginHelpers.js
 * @license ISC
 */

function getConnectorConfig(config, version, description, logo) {
    return {
        categoryId: config.categoryId,
        id: config.id,
        implementations: config.implementations,
        label: config.label,
        logo: logo || null,
        logoWidth: null,
        narrative: description || null,
        reference: `plugins%2Fconnectors%2F${config.usage === 'node' ? 'node' : 'data'}%2F${config.id}`,
        statusId: config.statusId,
        summary: config.summary,
        typeId: config.typeId,
        usageId: config.usageId,
        version: `v${version}`
    };
}

function getContextModelConfig(config, version) {
    return {
        categoryId: config.categoryId,
        dimensionCategories: config.dimensionCategories,
        dimensions: config.dimensions,
        entities: config.entities,
        id: config.id,
        label: config.label,
        measureCategories: config.measureCategories,
        measures: config.measures,
        presentationCategories: config.presentationCategories,
        presentations: config.presentations,
        reference: `plugins%2FcontextModels%2F${config.id}`,
        statusId: config.statusId,
        summary: config.summary,
        typeId: config.typeId,
        version: `v${version}`
    };
}

function getUsageKitConfig(config, version) {
    return {
        categoryId: config.categoryId,
        id: config.id,
        label: config.label,
        reference: `plugins%2FusageKits%2F${config.id}`,
        statusId: config.statusId,
        summary: config.summary,
        typeId: config.typeId,
        version: `v${version}`
    };
}

async function loadConnector(grunt, config, firebaseAPIKey, firebaseEmailAddress, firebasePassword, firebaseProjectId, sanityAPIToken, fetchModule) {
    try {
        // Sign in to firebase.
        const firebaseSignInResponse = await fetchModule.default(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseAPIKey}`, {
            body: JSON.stringify({ email: firebaseEmailAddress, password: firebasePassword, returnSecureToken: true }),
            headers: { Referer: `${firebaseProjectId}.web.app` },
            method: 'POST'
        });
        if (!firebaseSignInResponse.ok) {
            console.log(firebaseSignInResponse.status, firebaseSignInResponse.statusText, await firebaseSignInResponse.text());
            return false;
        }
        const firebaseSignInResult = await firebaseSignInResponse.json();

        // Retrieve description and logo.
        const description = grunt.file.read('./src/description.md');
        const logo = grunt.file.read('./src/logo.svg');

        // Upsert connector record in application service database (firestore).
        const firebaseUpsertResponse = await fetchModule.default(`https://europe-west1-${firebaseProjectId}.cloudfunctions.net/api/plugins`, {
            body: JSON.stringify(getConnectorConfig(config, grunt.config.data.pkg.version, description, logo)),
            headers: { Authorization: firebaseSignInResult.idToken, 'Content-Type': 'application/json' },
            method: 'POST'
        });
        if (!firebaseUpsertResponse.ok) {
            console.log(firebaseUpsertResponse.status, firebaseUpsertResponse.statusText, await firebaseUpsertResponse.text());
            return false;
        }
        console.log('Loaded connector instance to Firestore database.');

        // Upsert Sanity document.
        const createOrReplace = {
            _id: config.id,
            _type: 'dataStore',
            category: config.categoryId,
            description,
            // icon: { asset: { _ref: 'image-65aa51823e6437a14db0e6d86df0b2eca001b5cb-1200x800-svg' }, _type: 'reference' },
            label: config.label,
            logo,
            status: config.statusId,
            usage: config.usageId
        };
        const sanityUpsertResponse = await fetchModule.default('https://yxr5xjfo.api.sanity.io/v2021-06-07/data/mutate/library-production', {
            body: JSON.stringify({ mutations: [{ createOrReplace }] }),
            headers: { Authorization: `Bearer ${sanityAPIToken}`, 'Content-Type': 'application/json' },
            method: 'POST'
        });
        if (!sanityUpsertResponse.ok) {
            console.log(sanityUpsertResponse.status, sanityUpsertResponse.statusText, await sanityUpsertResponse.text());
            return false;
        }
        console.log('Loaded connector document to Sanity dataset.');

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function loadContextModel(grunt, config, firebaseAPIKey, firebaseEmailAddress, firebasePassword, firebaseProjectId, sanityAPIToken, fetchModule) {}

async function loadUsageKit(grunt, config, firebaseAPIKey, firebaseEmailAddress, firebasePassword, firebaseProjectId, sanityAPIToken, fetchModule) {}

module.exports = { loadConnector, loadContextModel, loadUsageKit };
