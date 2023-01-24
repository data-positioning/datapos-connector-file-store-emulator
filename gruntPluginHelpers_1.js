/**
 * @author Jonathan Terrell <terrell.jm@gmail.com>
 * @copyright 2022 Jonathan Terrell
 * @file datapos-engine/src/gruntPluginHelpers.js
 * @license ISC
 */

function getConnectorConfig(config, version) {
    return {
        categoryId: config.categoryId,
        id: config.id,
        implementations: config.implementations,
        label: config.label,
        logo: config.logo,
        narrative: config.narrative,
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

function loadConnector() {
    console.log('Load connector...');
}

module.exports = { getConnectorConfig, getContextModelConfig, getUsageKitConfig, loadConnector };
