//#region node_modules/nanoid/url-alphabet/index.js
var e = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict", t = (t = 21) => {
	let n = "", r = crypto.getRandomValues(new Uint8Array(t |= 0));
	for (; t--;) n += e[r[t] & 63];
	return n;
}, n;
async function r(e, t) {
	let { add_my_numbers: n } = await a();
	console.log(1111, e, t);
	let r = n(Math.trunc(e), Math.trunc(t));
	return console.log(2222, r), r;
}
async function i(e) {
	let { checksum_from_rust: t } = await a();
	return t(e);
}
async function a() {
	return n ??= import("./dpuse_connector_file_store_emulator_core-BbpaeCh_.js"), n;
}
//#endregion
//#region node_modules/@dpuse/dpuse-shared/dist/dpuse-shared-errors.es.js
var o = 2048, s = class extends Error {
	data;
	locator;
	constructor(e, t, n, r) {
		super(e, r), this.name = "DPUseError", this.data = n, this.locator = t;
	}
}, c = class extends s {
	constructor(e, t, n, r) {
		super(e, t, n, r), this.name = "ConnectorError";
	}
}, l = class extends s {
	constructor(e, t, n, r) {
		super(e, t, n, r), this.name = "FetchError";
	}
};
async function u(e, t, n) {
	let r = ` - ${e.statusText}`, i = `${t} Response status '${e.status}${e.statusText ? r : ""}' received.`, a;
	try {
		a = await e.text();
	} catch (e) {
		a = `<body unavailable: ${d(e).message}>`;
	}
	return new l(i, n, { body: f(a) });
}
function d(e) {
	if (e instanceof Error) return e;
	if (typeof e == "string") return Error(e);
	if (typeof e == "number" || typeof e == "boolean" || typeof e == "bigint") return Error(String(e));
	if (typeof e == "symbol") return Error(e.description ?? "Unknown error");
	if (typeof e == "object") try {
		return Error(JSON.stringify(e));
	} catch {
		return /* @__PURE__ */ Error("Unknown error");
	}
	return /* @__PURE__ */ Error("Unknown error");
}
function f(e) {
	if (!(e == null || e === "")) return e.length > o ? `${e.slice(0, o)}... [truncated]` : e;
}
//#endregion
//#region node_modules/@dpuse/dpuse-shared/dist/dpuse-shared-utilities.es.js
function p(e) {
	if (e) {
		let t = e.lastIndexOf("/") + 1, n = e.lastIndexOf(".");
		return n <= t || n === -1 ? e : e.slice(0, Math.max(0, n));
	}
}
function m(e) {
	if (e) {
		let t = e.lastIndexOf("/") + 1, n = e.lastIndexOf(".");
		if (n <= t) return;
		if (n !== -1) return e.slice(Math.max(0, n + 1));
	}
}
function h(e) {
	switch (e) {
		case "csv": return "text/csv";
		case "tab":
		case "tsv": return "text/tab-separated-values";
		case "xls": return "application/vnd.ms-excel";
		case "xlsx": return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
		default: return "application/octet-stream";
	}
}
//#endregion
//#region node_modules/@dpuse/dpuse-shared/dist/dpuse-shared-componentModuleTool.es.js
var g = "https://engine-eu.dpuse.app/tools";
async function _(e, t) {
	let n = `dpuse-tool-${t}`, r = e.find((e) => e.id === n);
	if (!r) throw Error(`Connector could not load unknown tool '${t}'.`);
	return new (await (import(
		/* @vite-ignore */
		`${g}/${t}_v${r.version}/${n}.es.js`
))).Tool();
}
//#endregion
//#region node_modules/@dpuse/dpuse-shared/dist/dpuse-shared-locale.es.js
function v(e) {
	return new Map(Object.entries(e));
}
//#endregion
//#region node_modules/@dpuse/dpuse-shared/dist/dpuse-shared-componentDataView.es.js
v({ en: "Data Positioning Events" }), v({ en: "Delimited Text" }), v({ en: "JSON" }), v({ en: "SPSS" }), v({ en: "XLSX" }), v({ en: "XML" }), v({ en: "Newline" }), v({ en: "Carriage Return" }), v({ en: "Carriage Return/Newline" }), v({ en: "Colon" }), v({ en: "Comma" }), v({ en: "Exclamation Mark" }), v({ en: "Record Separator" }), v({ en: "Semicolon" }), v({ en: "Space" }), v({ en: "Tab" }), v({ en: "Underscore" }), v({ en: "Unit Separator" }), v({ en: "Vertical Bar" });
var y = [
	",",
	";",
	"	",
	"|",
	" ",
	":",
	"_",
	"!",
	"0x1F",
	"0x1E"
], b = {
	id: "dpuse-connector-file-store-emulator",
	label: { en: "DPUse File Store" },
	description: { en: ["Provides access to a sample set of read-only data simulating a hypothetical cloud-based file storage solution. It is intended for demonstration, evaluation, and testing and is freely available to all users.", "It emulates services such as Google Drive, Dropbox, and Microsoft OneDrive."] },
	category: null,
	categoryId: "fileStore",
	firstCreatedAt: null,
	implementations: { default: {
		authMethodId: "none",
		maxConnectionCount: 1
	} },
	icon: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"black\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-folder-cog-icon lucide-folder-cog\"><path d=\"M10.3 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.98a2 2 0 0 1 1.69.9l.66 1.2A2 2 0 0 0 12 6h8a2 2 0 0 1 2 2v3.3\"/><path d=\"m14.305 19.53.923-.382\"/><path d=\"m15.228 16.852-.923-.383\"/><path d=\"m16.852 15.228-.383-.923\"/><path d=\"m16.852 20.772-.383.924\"/><path d=\"m19.148 15.228.383-.923\"/><path d=\"m19.53 21.696-.382-.924\"/><path d=\"m20.772 16.852.924-.383\"/><path d=\"m20.772 19.148.924.383\"/><circle cx=\"18\" cy=\"18\" r=\"3\"/></svg>",
	iconDark: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"white\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-folder-cog-icon lucide-folder-cog\"><path d=\"M10.3 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.98a2 2 0 0 1 1.69.9l.66 1.2A2 2 0 0 0 12 6h8a2 2 0 0 1 2 2v3.3\"/><path d=\"m14.305 19.53.923-.382\"/><path d=\"m15.228 16.852-.923-.383\"/><path d=\"m16.852 15.228-.383-.923\"/><path d=\"m16.852 20.772-.383.924\"/><path d=\"m19.148 15.228.383-.923\"/><path d=\"m19.53 21.696-.382-.924\"/><path d=\"m20.772 16.852.924-.383\"/><path d=\"m20.772 19.148.924.383\"/><circle cx=\"18\" cy=\"18\" r=\"3\"/></svg>",
	iconNeutral: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-folder-cog-icon lucide-folder-cog\"><path d=\"M10.3 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.98a2 2 0 0 1 1.69.9l.66 1.2A2 2 0 0 0 12 6h8a2 2 0 0 1 2 2v3.3\"/><path d=\"m14.305 19.53.923-.382\"/><path d=\"m15.228 16.852-.923-.383\"/><path d=\"m16.852 15.228-.383-.923\"/><path d=\"m16.852 20.772-.383.924\"/><path d=\"m19.148 15.228.383-.923\"/><path d=\"m19.53 21.696-.382-.924\"/><path d=\"m20.772 16.852.924-.383\"/><path d=\"m20.772 19.148.924.383\"/><circle cx=\"18\" cy=\"18\" r=\"3\"/></svg>",
	lastUpdatedAt: null,
	operations: [
		"abortOperation",
		"auditObjectContent",
		"findObject",
		"getReadableStream",
		"listNodes",
		"previewObject",
		"retrieveRecords"
	],
	status: null,
	statusId: "beta",
	typeId: "connector",
	vendorAccountURL: null,
	vendorDocumentationURL: null,
	vendorHomeURL: null,
	version: "0.2.558",
	usageId: "source"
}, x = {
	"": [
		{
			childCount: 3,
			name: "AUDATACY Interchange Format",
			typeId: "folder"
		},
		{
			childCount: 12,
			name: "Formula 1",
			typeId: "folder"
		},
		{
			childCount: 7,
			name: "Salesforce API",
			typeId: "folder"
		},
		{
			childCount: 156,
			name: "Salesforce Extract",
			typeId: "folder"
		},
		{
			childCount: 20,
			name: "SAP Employee Central Extract",
			typeId: "folder"
		},
		{
			childCount: 7,
			name: "SAP SuccessFactors API",
			typeId: "folder"
		},
		{
			childCount: 12,
			name: "Test Files",
			typeId: "folder"
		},
		{
			id: "rOjkS5HC7v7V0QBp29RVl",
			lastModifiedAt: 1774197102393.144,
			name: "ENGAGEMENT_START_EVENTS_202405121858.csv",
			size: 122800,
			typeId: "object"
		},
		{
			id: "g_wqkKYop4QzGpXVyh8HS",
			lastModifiedAt: 1774197102397.963,
			name: "PEOPLE_BIRTH_EVENTS_202405121857.csv",
			size: 114287,
			typeId: "object"
		}
	],
	"/AUDATACY Interchange Format": [
		{
			childCount: 11,
			name: "Coded Data",
			typeId: "folder"
		},
		{
			childCount: 1,
			name: "Human Resources",
			typeId: "folder"
		},
		{
			childCount: 1,
			name: "Party",
			typeId: "folder"
		}
	],
	"/AUDATACY Interchange Format/Coded Data": [
		{
			id: "vsZ8DQTMKc_MwaOk91gRG",
			lastModifiedAt: 1774197102391.735,
			name: "01. Coded Data - All.csv",
			size: 13002,
			typeId: "object"
		},
		{
			id: "xszoviHJOJ2GFALjxQ5ZL",
			lastModifiedAt: 1774197102391.7979,
			name: "02. Coded Types - All.csv",
			size: 93,
			typeId: "object"
		},
		{
			id: "YVrOBsPCUWwa7gkHc0hLw",
			lastModifiedAt: 1774197102391.8613,
			name: "03. Coded Types - Ids.csv",
			size: 48,
			typeId: "object"
		},
		{
			id: "DDmuSyD74G0dgSmUnrQu3",
			lastModifiedAt: 1774197102391.9204,
			name: "04. Coded Types - Labels - Linked by Id.csv",
			size: 101,
			typeId: "object"
		},
		{
			id: "dlGxhNoVeC37V-3NbOpeS",
			lastModifiedAt: 1774197102391.9792,
			name: "05. Coded Types - Labels - Linked by Alternate Id.csv",
			size: 96,
			typeId: "object"
		},
		{
			id: "Vb2puKicRcLrAU8N0wbUD",
			lastModifiedAt: 1774197102392.081,
			name: "06. Coded Values - All - Linked by Id.csv",
			size: 9502,
			typeId: "object"
		},
		{
			id: "yJcSghfP4VOTn_EGbFPtQ",
			lastModifiedAt: 1774197102392.1558,
			name: "07. Coded Values - All - Linked by Alternate Id.csv",
			size: 7269,
			typeId: "object"
		},
		{
			id: "qLUpwFmytiRy0ZK9OUHJr",
			lastModifiedAt: 1774197102392.2258,
			name: "08. Coded Values - Ids - Linked by Id.csv",
			size: 5524,
			typeId: "object"
		},
		{
			id: "Wj5Dzy_c33xqIm0it_-Cr",
			lastModifiedAt: 1774197102392.2893,
			name: "09. Coded Values - Ids - Linked by Alternate Id.csv",
			size: 3291,
			typeId: "object"
		},
		{
			id: "Q7Wuff50ZdRCTf5x2tqgg",
			lastModifiedAt: 1774197102392.3757,
			name: "10. Coded Values - Labels - Linked by Id.csv",
			size: 9752,
			typeId: "object"
		},
		{
			id: "tY6B-hw10Dn4re8wjmDmT",
			lastModifiedAt: 1774197102392.4438,
			name: "11. Coded Values - Labels - Linked by Alternate Id.csv",
			size: 7512,
			typeId: "object"
		}
	],
	"/AUDATACY Interchange Format/Human Resources": [{
		childCount: 2,
		name: "Workforce",
		typeId: "folder"
	}],
	"/AUDATACY Interchange Format/Human Resources/Workforce": [{
		id: "cPNdiq9jdPnlt9IHQ9z6e",
		lastModifiedAt: 1774197102392.6282,
		name: "Jobs.csv",
		size: 13913,
		typeId: "object"
	}, {
		id: "McemcVOV1J6RFKm9C-BH7",
		lastModifiedAt: 1774197102392.7075,
		name: "Work Contracts.csv",
		size: 13931,
		typeId: "object"
	}],
	"/AUDATACY Interchange Format/Party": [{
		id: "hVBcK7eRhraZgWK3zfgI1",
		lastModifiedAt: 1774197102392.9854,
		name: "People.csv",
		size: 139407,
		typeId: "object"
	}],
	"/Formula 1": [
		{
			id: "LXkVPRN4yL0GgjV5-FDZH",
			lastModifiedAt: 1774197102393.2888,
			name: "circuits.csv",
			size: 9406,
			typeId: "object"
		},
		{
			id: "TjmZm3PcQIomRLTzzkdvM",
			lastModifiedAt: 1774197102393.5789,
			name: "constructor_results.csv",
			size: 191446,
			typeId: "object"
		},
		{
			id: "r5OPLOuTszyCUd4KjmF8t",
			lastModifiedAt: 1774197102393.9597,
			name: "constructor_standings.csv",
			size: 280013,
			typeId: "object"
		},
		{
			id: "_3__8H0i-yOs7wf9-K3hV",
			lastModifiedAt: 1774197102394.0488,
			name: "constructors.csv",
			size: 17021,
			typeId: "object"
		},
		{
			id: "X85JnlnclRhu4fJN0CJ39",
			lastModifiedAt: 1774197102395.1616,
			name: "driver_standings.csv",
			size: 801809,
			typeId: "object"
		},
		{
			id: "QIjSngcyg2y4f7lV4OjGm",
			lastModifiedAt: 1774197102394.209,
			name: "driver.csv",
			size: 92286,
			typeId: "object"
		},
		{
			id: "-kBvY5M7viDjLYO-ddj6a",
			lastModifiedAt: 1774197102395.5283,
			name: "pit_stops.csv",
			size: 244191,
			typeId: "object"
		},
		{
			id: "rWWu4htvUYuQrE8tXzAAL",
			lastModifiedAt: 1774197102395.9692,
			name: "qualifying.csv",
			size: 323654,
			typeId: "object"
		},
		{
			id: "zK0PbFzgrbDbJYfaB4OIa",
			lastModifiedAt: 1774197102396.1106,
			name: "races.csv",
			size: 109577,
			typeId: "object"
		},
		{
			id: "3DML3204VUN9jRNL1yHO6",
			lastModifiedAt: 1774197102397.6895,
			name: "results.csv",
			size: 1492404,
			typeId: "object"
		},
		{
			id: "40eRsC0aQ6sdpzYy0NeuA",
			lastModifiedAt: 1774197102397.7734,
			name: "seasons.csv",
			size: 4158,
			typeId: "object"
		},
		{
			id: "j2BvzwGkLVrDv7m_W5TQN",
			lastModifiedAt: 1774197102397.828,
			name: "status.csv",
			size: 2043,
			typeId: "object"
		}
	],
	"/SAP Employee Central Extract": [
		{
			id: "gW5Ohfzlm4WZlNnkxcy7R",
			lastModifiedAt: 1774197102398.2551,
			name: "ADDRESS_INFO.csv",
			size: 224543,
			typeId: "object"
		},
		{
			id: "aW6FtFYCPyxsR1qDOoqIe",
			lastModifiedAt: 1774197102398.33,
			name: "COMP_CUR_CONV.csv",
			size: 2245,
			typeId: "object"
		},
		{
			id: "T9BGB55QfnrSJot0Dasw9",
			lastModifiedAt: 1774197102399.8057,
			name: "EMP_COMP_INFO.csv",
			size: 1665179,
			typeId: "object"
		},
		{
			id: "sOcTpL4ZbgqTjvXICGb8D",
			lastModifiedAt: 1774197102401.1045,
			name: "EMP_PAYCOMP_RECURRING.csv",
			size: 1551764,
			typeId: "object"
		},
		{
			id: "UQD04voD_4ykksPcD3VK-",
			lastModifiedAt: 1774197102398.8108,
			name: "EMPLOYMENT_INFO_original.csv",
			size: 128575,
			typeId: "object"
		},
		{
			id: "dRiZQ7SHxCzXj-Rg5GiIu",
			lastModifiedAt: 1774197102398.5945,
			name: "EMPLOYMENT_INFO.csv",
			size: 138931,
			typeId: "object"
		},
		{
			id: "gxGWJ3escmUU56jytxnXy",
			lastModifiedAt: 1774197102401.2026,
			name: "EVENT_REASONS.csv",
			size: 7775,
			typeId: "object"
		},
		{
			id: "3YXjgEN1FjtewmHyN_mnF",
			lastModifiedAt: 1774197102401.2585,
			name: "FREQUENCY.csv",
			size: 1704,
			typeId: "object"
		},
		{
			id: "U1PweZ740_8WD88bpUYSi",
			lastModifiedAt: 1774197102403.176,
			name: "GENERIC_OBJECTS.csv",
			size: 1736573,
			typeId: "object"
		},
		{
			id: "IpFCg6h4ZqaotPrKxjUvb",
			lastModifiedAt: 1774197102403.334,
			name: "GENERIC_RELATIONSHIPS.csv",
			size: 98782,
			typeId: "object"
		},
		{
			id: "GsGt4_Euinedlsxtvj4P6",
			lastModifiedAt: 1774197102403.6628,
			name: "JOB_CLASS.csv",
			size: 338260,
			typeId: "object"
		},
		{
			id: "DSsuNczsBlQpk1eYgVSOr",
			lastModifiedAt: 1774197102405.5874,
			name: "JOB_INFO.csv",
			size: 1569311,
			typeId: "object"
		},
		{
			id: "YRk85yEyt9NkoSQcT4nfl",
			lastModifiedAt: 1774197102405.81,
			name: "LABELS.csv",
			size: 126838,
			typeId: "object"
		},
		{
			id: "R1eRroq_2QwKCEIyk2K_Z",
			lastModifiedAt: 1774197102405.8901,
			name: "LOCATIONS.csv",
			size: 3167,
			typeId: "object"
		},
		{
			id: "HZgaBNQMijU7MaXYeIRpM",
			lastModifiedAt: 1774197102405.947,
			name: "PAY_COMPONENT.csv",
			size: 1234,
			typeId: "object"
		},
		{
			id: "FO1wiDdWmoz2NJI8OwB05",
			lastModifiedAt: 1774197102406.4124,
			name: "PERSON_INFO_GLOBAL.csv",
			size: 89782,
			typeId: "object"
		},
		{
			id: "WDuo0zKE-hS12WHgmFw9f",
			lastModifiedAt: 1774197102406.054,
			name: "PERSON.csv",
			size: 49146,
			typeId: "object"
		},
		{
			id: "QXIYw_Az1QfJsp9X1wTnq",
			lastModifiedAt: 1774197102406.2827,
			name: "PERSONAL_DATA.csv",
			size: 114645,
			typeId: "object"
		},
		{
			id: "kXaGiYtK1Rj9JJTzT0gZe",
			lastModifiedAt: 1774197102406.572,
			name: "PICKLISTS.csv",
			size: 78044,
			typeId: "object"
		},
		{
			id: "vU4PX32qu8Hdfdlx-2h7J",
			lastModifiedAt: 1774197102406.685,
			name: "TERRITORY.csv",
			size: 8541,
			typeId: "object"
		}
	],
	"/SAP SuccessFactors API": [
		{
			childCount: 6,
			name: "sapSuccessFactors",
			typeId: "folder"
		},
		{
			id: "mVE5_aNCVOh9IVHXxZl6x",
			lastModifiedAt: 1774197102407.0752,
			name: "empEmployment.csv",
			size: 151656,
			typeId: "object"
		},
		{
			id: "lmASRBS69sd2hPXrJ0y5K",
			lastModifiedAt: 1774197102408.0403,
			name: "empJob.csv",
			size: 1193715,
			typeId: "object"
		},
		{
			id: "H1MgJxSEvBneWf0em1gDm",
			lastModifiedAt: 1774197102408.17,
			name: "perGlobalInfoGBR.csv",
			size: 76314,
			typeId: "object"
		},
		{
			id: "g9fvLLkKTVhtoWXNMQ0qS",
			lastModifiedAt: 1774197102408.304,
			name: "perGlobalInfoUSA.csv",
			size: 4942,
			typeId: "object"
		},
		{
			id: "ucH2984DDJIETmNVILKC6",
			lastModifiedAt: 1774197102406.8608,
			name: "PerPerson.csv",
			size: 77318,
			typeId: "object"
		},
		{
			id: "EaYPWSFMeWZ2dfCxFlvj2",
			lastModifiedAt: 1774197102408.4414,
			name: "perPersonal.csv",
			size: 119305,
			typeId: "object"
		}
	],
	"/SAP SuccessFactors API/sapSuccessFactors": [
		{
			id: "HnmU8hVxSb9mj0C6Q8bFr",
			lastModifiedAt: 1774197102408.669,
			name: "empEmployment.csv",
			size: 151656,
			typeId: "object"
		},
		{
			id: "wiQxsBAacSqq68GxdUQvY",
			lastModifiedAt: 1774197102409.4956,
			name: "empJob.csv",
			size: 1193715,
			typeId: "object"
		},
		{
			id: "PCG-ltwgGna_Tdi0S6jie",
			lastModifiedAt: 1774197102409.587,
			name: "perGlobalInfoGBR.csv",
			size: 76314,
			typeId: "object"
		},
		{
			id: "MDtjN8DjMEgUUV1O-V8im",
			lastModifiedAt: 1774197102409.651,
			name: "perGlobalInfoUSA.csv",
			size: 4942,
			typeId: "object"
		},
		{
			id: "v4Er9g6f-6N8bHEOrSbao",
			lastModifiedAt: 1774197102409.7698,
			name: "perPerson.csv",
			size: 77318,
			typeId: "object"
		},
		{
			id: "b_dHBP95onESbsrMNO_0G",
			lastModifiedAt: 1774197102409.9028,
			name: "perPersonal.csv",
			size: 119305,
			typeId: "object"
		}
	],
	"/Salesforce API": [
		{
			childCount: 6,
			name: "salesforce",
			typeId: "folder"
		},
		{
			id: "6rnzMqnX5JYB5E0UygEvL",
			lastModifiedAt: 1774197102410.0098,
			name: "Account.csv",
			size: 7383,
			typeId: "object"
		},
		{
			id: "Jq7nq-rwgWY-Vb1L_SFpA",
			lastModifiedAt: 1774197102410.0703,
			name: "Campaign.csv",
			size: 1655,
			typeId: "object"
		},
		{
			id: "M7QDdrzZi09Nhh8zH6TTx",
			lastModifiedAt: 1774197102410.1555,
			name: "Contact.csv",
			size: 8936,
			typeId: "object"
		},
		{
			id: "YAO8kO1ngn7gV9lLgBfPq",
			lastModifiedAt: 1774197102410.2373,
			name: "Lead.csv",
			size: 9606,
			typeId: "object"
		},
		{
			id: "a9mwabCGbgA4yDkabGeze",
			lastModifiedAt: 1774197102410.324,
			name: "Opportunity.csv",
			size: 11811,
			typeId: "object"
		},
		{
			id: "Y6ztc5kyQMhFx500IGJL8",
			lastModifiedAt: 1774197102410.3928,
			name: "Product2.csv",
			size: 2926,
			typeId: "object"
		}
	],
	"/Salesforce API/salesforce": [
		{
			id: "MEnv_-ckbJHpFL3gCyjPV",
			lastModifiedAt: 1774197102410.4963,
			name: "Account.csv",
			size: 7383,
			typeId: "object"
		},
		{
			id: "XiVAbVXIPZu662OGlhC-u",
			lastModifiedAt: 1774197102410.555,
			name: "Campaign.csv",
			size: 1655,
			typeId: "object"
		},
		{
			id: "qdKDdwKSxaq4mocU7KmhQ",
			lastModifiedAt: 1774197102410.6333,
			name: "Contact.csv",
			size: 8936,
			typeId: "object"
		},
		{
			id: "--9EdJk72PJ-lWehYyJES",
			lastModifiedAt: 1774197102410.6995,
			name: "Lead.csv",
			size: 9606,
			typeId: "object"
		},
		{
			id: "2s-bP3gLRMSP74PlW9EFu",
			lastModifiedAt: 1774197102410.7737,
			name: "Opportunity.csv",
			size: 11811,
			typeId: "object"
		},
		{
			id: "Ef0kLwk1qOpmQrDC6Jx_9",
			lastModifiedAt: 1774197102410.8337,
			name: "Product2.csv",
			size: 2926,
			typeId: "object"
		}
	],
	"/Salesforce Extract": [
		{
			id: "DAslEJv13C1XTI9DFhY9w",
			lastModifiedAt: 1774197102410.9546,
			name: "Account.csv",
			size: 8778,
			typeId: "object"
		},
		{
			id: "c1xVmGlEFCu12rbubvg_y",
			lastModifiedAt: 1774197102411.0117,
			name: "AccountContactRole.csv",
			size: 143,
			typeId: "object"
		},
		{
			id: "i4p6WwNZj7x9UkrECiIp7",
			lastModifiedAt: 1774197102411.072,
			name: "ActionLinkTemplateBinding.csv",
			size: 141,
			typeId: "object"
		},
		{
			id: "YyzABjynKiDKF5IpB-Li0",
			lastModifiedAt: 1774197102411.13,
			name: "Announcement.csv",
			size: 163,
			typeId: "object"
		},
		{
			id: "mpLNNlx6rZ11j-jEwmyf8",
			lastModifiedAt: 1774197102411.1904,
			name: "Asset.csv",
			size: 373,
			typeId: "object"
		},
		{
			id: "SRqOyL1Amx9l1BR66L23z",
			lastModifiedAt: 1774197102411.249,
			name: "AssetRelationship.csv",
			size: 192,
			typeId: "object"
		},
		{
			id: "PZjgIwacW6Ec2sLUuM7c9",
			lastModifiedAt: 1774197102411.3066,
			name: "AssistantInteraction.csv",
			size: 167,
			typeId: "object"
		},
		{
			id: "cnFjQ-IEGJbnraCJkOnvC",
			lastModifiedAt: 1774197102411.3667,
			name: "AssistantProgress.csv",
			size: 136,
			typeId: "object"
		},
		{
			id: "PV5MccCy72V46AGeZBts2",
			lastModifiedAt: 1774197102411.4292,
			name: "AssistantRecommendation.csv",
			size: 228,
			typeId: "object"
		},
		{
			id: "BuDMUmGGaJDCETdTwCxYK",
			lastModifiedAt: 1774197102411.4907,
			name: "BusinessProcess.csv",
			size: 136,
			typeId: "object"
		},
		{
			id: "_tgZwYTxdpNBo27GmrucA",
			lastModifiedAt: 1774197102411.5447,
			name: "Campaign.csv",
			size: 2510,
			typeId: "object"
		},
		{
			id: "uACdVytJoRhcdw7q0fvNm",
			lastModifiedAt: 1774197102411.7205,
			name: "CampaignMember.csv",
			size: 191,
			typeId: "object"
		},
		{
			id: "lfaASyx-ulydV87_y2z5E",
			lastModifiedAt: 1774197102411.7715,
			name: "CanvasFeedItem.csv",
			size: 226,
			typeId: "object"
		},
		{
			id: "WmjyVfRb43BDlCvBvaR02",
			lastModifiedAt: 1774197102411.8682,
			name: "Case.csv",
			size: 11952,
			typeId: "object"
		},
		{
			id: "dvyicYq1AF5zMgDvlV6_K",
			lastModifiedAt: 1774197102411.9233,
			name: "CaseComment.csv",
			size: 153,
			typeId: "object"
		},
		{
			id: "BMViOBvxdXiXYMHsZ46nJ",
			lastModifiedAt: 1774197102411.9705,
			name: "CaseContactRole.csv",
			size: 129,
			typeId: "object"
		},
		{
			id: "U1Ga0sLZVrJQJV5ITfrX-",
			lastModifiedAt: 1774197102412.0237,
			name: "CaseHistory2.csv",
			size: 3263,
			typeId: "object"
		},
		{
			id: "iwJB-Ud0Joqi87Id52vbh",
			lastModifiedAt: 1774197102412.0771,
			name: "CaseSolution.csv",
			size: 84,
			typeId: "object"
		},
		{
			id: "IxYE_rUWBiQZ1yQHxtwEH",
			lastModifiedAt: 1774197102412.1326,
			name: "CleanFactFieldClaim.csv",
			size: 174,
			typeId: "object"
		},
		{
			id: "mRvJ_yrJ0LjfWFZKdtj4d",
			lastModifiedAt: 1774197102412.1868,
			name: "CollaborationGroupRank.csv",
			size: 200,
			typeId: "object"
		},
		{
			id: "T8rrchWSHeatMr95ZlCrH",
			lastModifiedAt: 1774197102412.2358,
			name: "CollaborationGroupRecord.csv",
			size: 174,
			typeId: "object"
		},
		{
			id: "IIAzj6keAQo5GlS5_baJh",
			lastModifiedAt: 1774197102412.2856,
			name: "ComponentResponseCache.csv",
			size: 170,
			typeId: "object"
		},
		{
			id: "W4sp52Ay6AyUPQI-XFaLV",
			lastModifiedAt: 1774197102412.3582,
			name: "Contact.csv",
			size: 11188,
			typeId: "object"
		},
		{
			id: "xneVIxFAPigHiD2PM1xiu",
			lastModifiedAt: 1774197102412.4229,
			name: "ContentDocumentLink.csv",
			size: 304,
			typeId: "object"
		},
		{
			id: "DDG3a7DM-bujChBmUBZRC",
			lastModifiedAt: 1774197102412.4905,
			name: "ContentFolder.csv",
			size: 158,
			typeId: "object"
		},
		{
			id: "zr93rEKgogXZopjSWgnym",
			lastModifiedAt: 1774197102412.5493,
			name: "ContentVersion.csv",
			size: 1042,
			typeId: "object"
		},
		{
			id: "oDgS4LNa81Kch8Awdcvz0",
			lastModifiedAt: 1774197102412.607,
			name: "Contract.csv",
			size: 729,
			typeId: "object"
		},
		{
			id: "yfyWXV6bdWV7T-Em23JQA",
			lastModifiedAt: 1774197102412.6633,
			name: "ContractContactRole.csv",
			size: 144,
			typeId: "object"
		},
		{
			id: "wtNBGQ43IzQWtMO6pDB0-",
			lastModifiedAt: 1774197102412.7195,
			name: "CustomSettingNameIndex.csv",
			size: 191,
			typeId: "object"
		},
		{
			id: "5pbdqWTP5gvUIvWBLd3Xp",
			lastModifiedAt: 1774197102412.7766,
			name: "Data__c.csv",
			size: 136,
			typeId: "object"
		},
		{
			id: "DK4co-3RNZnT_oHjkJ9h7",
			lastModifiedAt: 1774197102412.8318,
			name: "DatacloudOwnedEntity.csv",
			size: 187,
			typeId: "object"
		},
		{
			id: "MQDcaokn_rXVz9KVPpAAa",
			lastModifiedAt: 1774197102412.8906,
			name: "DatacloudPurchaseUsage.csv",
			size: 186,
			typeId: "object"
		},
		{
			id: "c2CSYs1-EVYN8ujBbP35O",
			lastModifiedAt: 1774197102412.9517,
			name: "EmailDisclaimer.csv",
			size: 174,
			typeId: "object"
		},
		{
			id: "k48GlOj1uPGYVkEQAOU-H",
			lastModifiedAt: 1774197102413.02,
			name: "EmailMessage.csv",
			size: 426,
			typeId: "object"
		},
		{
			id: "sgnZGMTmJmhlbXYhwZppN",
			lastModifiedAt: 1774197102413.082,
			name: "EmailRoutingAddress.csv",
			size: 237,
			typeId: "object"
		},
		{
			id: "rT5gbSccD-Am9RluV2VPm",
			lastModifiedAt: 1774197102413.139,
			name: "Endorsement.csv",
			size: 189,
			typeId: "object"
		},
		{
			id: "kDsEufyL9KfUZgVeweF4Q",
			lastModifiedAt: 1774197102413.2341,
			name: "EngagementHistoryRollup.csv",
			size: 219,
			typeId: "object"
		},
		{
			id: "dSZEu64pwdgyKpLHkIK7C",
			lastModifiedAt: 1774197102413.2986,
			name: "EntityHistory.csv",
			size: 562,
			typeId: "object"
		},
		{
			id: "uLToUz0Y-FSQ08xhYj2rv",
			lastModifiedAt: 1774197102413.3552,
			name: "EntitySubscription.csv",
			size: 71,
			typeId: "object"
		},
		{
			id: "Op71VoK7V3HPLDV-4ow-X",
			lastModifiedAt: 1774197102413.4167,
			name: "Event.csv",
			size: 634,
			typeId: "object"
		},
		{
			id: "3Vc36z3iwSVNfqWdeE24-",
			lastModifiedAt: 1774197102413.4885,
			name: "EventDeliveryData.csv",
			size: 152,
			typeId: "object"
		},
		{
			id: "fZHHke_fPY5VBhit85i5Z",
			lastModifiedAt: 1774197102413.5496,
			name: "EventParameterData.csv",
			size: 161,
			typeId: "object"
		},
		{
			id: "LH_qGJuIhAAzXqtcDqzSz",
			lastModifiedAt: 1774197102413.6096,
			name: "EventRelation.csv",
			size: 203,
			typeId: "object"
		},
		{
			id: "arahNDKlZHJQN8DzLwVRX",
			lastModifiedAt: 1774197102413.6648,
			name: "EventSubscriptionData.csv",
			size: 128,
			typeId: "object"
		},
		{
			id: "wBoTsqYTQZ8P3Gbs58SxZ",
			lastModifiedAt: 1774197102413.727,
			name: "EventSubscriptionHandleData.csv",
			size: 145,
			typeId: "object"
		},
		{
			id: "xRgMQz2xrz1tiuPp0z-tx",
			lastModifiedAt: 1774197102413.7822,
			name: "ExchangeUserMapping.csv",
			size: 177,
			typeId: "object"
		},
		{
			id: "cmh2ubSZKeq_6VcIyBbV0",
			lastModifiedAt: 1774197102413.837,
			name: "FeedComment.csv",
			size: 294,
			typeId: "object"
		},
		{
			id: "X6wCzbk0UGOxJBfDq2mYR",
			lastModifiedAt: 1774197102413.8967,
			name: "FeedFieldHistory.csv",
			size: 5835,
			typeId: "object"
		},
		{
			id: "5V5b4Cy-4lU6uQTRMOict",
			lastModifiedAt: 1774197102413.9492,
			name: "FeedMute.csv",
			size: 138,
			typeId: "object"
		},
		{
			id: "IDumruMFvEpBOGs5jJNgl",
			lastModifiedAt: 1774197102414.0066,
			name: "FeedPost.csv",
			size: 176,
			typeId: "object"
		},
		{
			id: "Mn-AOgTngLuJDMXSrwup1",
			lastModifiedAt: 1774197102414.0645,
			name: "FeedTrackedChange.csv",
			size: 308,
			typeId: "object"
		},
		{
			id: "p_KqX_t0XPZnC3pFD6qMg",
			lastModifiedAt: 1774197102414.162,
			name: "FieldHistory.csv",
			size: 8658,
			typeId: "object"
		},
		{
			id: "sV5k6Gebc-69tR_qZ2I18",
			lastModifiedAt: 1774197102414.2207,
			name: "FileInspectionResult.csv",
			size: 265,
			typeId: "object"
		},
		{
			id: "ggztGDA4U7QHIH8_YEqTE",
			lastModifiedAt: 1774197102414.2817,
			name: "FileSearchActivity.csv",
			size: 1865,
			typeId: "object"
		},
		{
			id: "hE_P-Jl8JXejE9SvICeCP",
			lastModifiedAt: 1774197102414.3376,
			name: "FiscalYearSettings.csv",
			size: 187,
			typeId: "object"
		},
		{
			id: "GUTRw2_n9lFEXuunjBOZv",
			lastModifiedAt: 1774197102414.3926,
			name: "FlowInterview.csv",
			size: 233,
			typeId: "object"
		},
		{
			id: "OifTLP7ZmdiIPAxrVzjPC",
			lastModifiedAt: 1774197102414.4465,
			name: "FlowRecordRelation.csv",
			size: 136,
			typeId: "object"
		},
		{
			id: "9SxlpECcHhJipzAvBZODM",
			lastModifiedAt: 1774197102414.5005,
			name: "FlowStageRelation.csv",
			size: 153,
			typeId: "object"
		},
		{
			id: "Rlfipqur7AMWZfyeHKz5V",
			lastModifiedAt: 1774197102414.5515,
			name: "Goal.csv",
			size: 236,
			typeId: "object"
		},
		{
			id: "NV1b_u8_6VKlM3_l3HgHT",
			lastModifiedAt: 1774197102414.6055,
			name: "GoalLink.csv",
			size: 134,
			typeId: "object"
		},
		{
			id: "SiPxNqq0z3kS3wN0qGxF-",
			lastModifiedAt: 1774197102414.659,
			name: "GroupSubscription.csv",
			size: 71,
			typeId: "object"
		},
		{
			id: "iVItjLf5nsUurzsNCiKgk",
			lastModifiedAt: 1774197102414.714,
			name: "Idea.csv",
			size: 233,
			typeId: "object"
		},
		{
			id: "ND4BV-vacH-MsQZKiZdXQ",
			lastModifiedAt: 1774197102414.7698,
			name: "IdeaComment.csv",
			size: 122,
			typeId: "object"
		},
		{
			id: "FxePxz-HEPAIP2oBsREiP",
			lastModifiedAt: 1774197102414.8271,
			name: "InboundSocialPost.csv",
			size: 204,
			typeId: "object"
		},
		{
			id: "IriuMmPc2YXXs-hW4KFrF",
			lastModifiedAt: 1774197102414.8906,
			name: "InstalledMobileApp.csv",
			size: 160,
			typeId: "object"
		},
		{
			id: "VINJWtZqUQ0oXi3ptZu46",
			lastModifiedAt: 1774197102414.9556,
			name: "InteractionCountReport.csv",
			size: 194,
			typeId: "object"
		},
		{
			id: "VGxxatAC-SRtlk7C-Wh_-",
			lastModifiedAt: 1774197102415.0117,
			name: "JigsawSavedSearch.csv",
			size: 171,
			typeId: "object"
		},
		{
			id: "vNTmFqgSPmLfPvsxSVJzk",
			lastModifiedAt: 1774197102415.0632,
			name: "JobTracker.csv",
			size: 232,
			typeId: "object"
		},
		{
			id: "dv1pWHJrzftL9HzZp-L-8",
			lastModifiedAt: 1774197102415.4182,
			name: "Lead.csv",
			size: 12692,
			typeId: "object"
		},
		{
			id: "7_cp70Lx5M7wMd2Pa7KPU",
			lastModifiedAt: 1774197102415.5356,
			name: "LinkedInLeadGen.csv",
			size: 545,
			typeId: "object"
		},
		{
			id: "hiOArN8c4zve8bsGki0dn",
			lastModifiedAt: 1774197102415.4758,
			name: "LinkReference.csv",
			size: 118,
			typeId: "object"
		},
		{
			id: "mUJ2hAF_CrswTgVW9sjgC",
			lastModifiedAt: 1774197102415.5952,
			name: "ListEmail.csv",
			size: 307,
			typeId: "object"
		},
		{
			id: "y_kOT0K-Ddt5WVdtBorCf",
			lastModifiedAt: 1774197102415.7544,
			name: "ListEmailRecipientSource.csv",
			size: 149,
			typeId: "object"
		},
		{
			id: "G76R63zUKupgXyd0oIkgp",
			lastModifiedAt: 1774197102415.8096,
			name: "ListEmailSentResult.csv",
			size: 172,
			typeId: "object"
		},
		{
			id: "3JFN1tJ2AAQb4t-ke5yMK",
			lastModifiedAt: 1774197102415.864,
			name: "Macro.csv",
			size: 168,
			typeId: "object"
		},
		{
			id: "h8iSc7WgBm3bF15Epdpyj",
			lastModifiedAt: 1774197102415.9187,
			name: "MacroAction.csv",
			size: 197,
			typeId: "object"
		},
		{
			id: "-j3V2Xr9ywXTK3DA8UymH",
			lastModifiedAt: 1774197102415.9753,
			name: "MacroInstruction.csv",
			size: 172,
			typeId: "object"
		},
		{
			id: "ZRmhKLKGiE6o7DFIQcrDJ",
			lastModifiedAt: 1774197102416.0347,
			name: "ManagedContentBlock.csv",
			size: 114,
			typeId: "object"
		},
		{
			id: "tNciZfxzUbjtIvFzl96gO",
			lastModifiedAt: 1774197102416.0903,
			name: "ManagedContentBlockVersion.csv",
			size: 276,
			typeId: "object"
		},
		{
			id: "42HbSyu3JeHdAsxUsfevJ",
			lastModifiedAt: 1774197102416.1545,
			name: "MatchingInformation.csv",
			size: 194,
			typeId: "object"
		},
		{
			id: "jGDw0D3hb7YhFpCf1OIij",
			lastModifiedAt: 1774197102416.2175,
			name: "Metric.csv",
			size: 301,
			typeId: "object"
		},
		{
			id: "fOcvpyWn0OwQM7ytidvfP",
			lastModifiedAt: 1774197102416.2837,
			name: "MetricDataLink.csv",
			size: 181,
			typeId: "object"
		},
		{
			id: "ggG6NUzgWaEypQozvNcwi",
			lastModifiedAt: 1774197102416.3462,
			name: "MetricsTransmissionHistory.csv",
			size: 197,
			typeId: "object"
		},
		{
			id: "ok_b4nDu_H26bXR-V4RFX",
			lastModifiedAt: 1774197102416.405,
			name: "NewsFeed.csv",
			size: 316,
			typeId: "object"
		},
		{
			id: "7ZZKGTZBCmuOYoLsqD7E8",
			lastModifiedAt: 1774197102416.471,
			name: "Note.csv",
			size: 160,
			typeId: "object"
		},
		{
			id: "G5PgKBX5qakOZ_1pHPk9p",
			lastModifiedAt: 1774197102416.5312,
			name: "NotifDeliveryUserPref.csv",
			size: 165,
			typeId: "object"
		},
		{
			id: "aXz9k-6FdzWdaWZRL7IBT",
			lastModifiedAt: 1774197102416.587,
			name: "NotificationMember.csv",
			size: 138,
			typeId: "object"
		},
		{
			id: "0Pl8cmE__TaeKs-A8Jm4Q",
			lastModifiedAt: 1774197102416.6816,
			name: "Opportunity.csv",
			size: 14323,
			typeId: "object"
		},
		{
			id: "GWnGDZ3Rn01mmeiwqoELC",
			lastModifiedAt: 1774197102416.7415,
			name: "OpportunityCompetitor.csv",
			size: 158,
			typeId: "object"
		},
		{
			id: "T4T-8JKN_5Zb3L4P5H15Y",
			lastModifiedAt: 1774197102416.8,
			name: "OpportunityContactRole.csv",
			size: 135,
			typeId: "object"
		},
		{
			id: "MJaa3qEHwy-17DYzGn2uO",
			lastModifiedAt: 1774197102416.8586,
			name: "OpportunityHistory.csv",
			size: 7076,
			typeId: "object"
		},
		{
			id: "-pmP-SistHLAL8XnYx-CO",
			lastModifiedAt: 1774197102416.9214,
			name: "OpportunityLineItem.csv",
			size: 222,
			typeId: "object"
		},
		{
			id: "zcufWCPsBFsOUr0GHv6m7",
			lastModifiedAt: 1774197102416.9807,
			name: "Order.csv",
			size: 812,
			typeId: "object"
		},
		{
			id: "a5NjQIslJhXet_trgZa4I",
			lastModifiedAt: 1774197102417.0393,
			name: "OrderItem.csv",
			size: 262,
			typeId: "object"
		},
		{
			id: "fYu7pLUm5Ljk0paOL-BZ0",
			lastModifiedAt: 1774197102417.1003,
			name: "OrgDeleteRequest.csv",
			size: 131,
			typeId: "object"
		},
		{
			id: "fmhCN7Ir0AkLehWTOFo4w",
			lastModifiedAt: 1774197102417.153,
			name: "OrgWideEmailAddress.csv",
			size: 167,
			typeId: "object"
		},
		{
			id: "nn99ipsPM1oIIU3lZHjdQ",
			lastModifiedAt: 1774197102417.216,
			name: "Partner.csv",
			size: 184,
			typeId: "object"
		},
		{
			id: "8ZGyI_h3kCRhFhizCVvcS",
			lastModifiedAt: 1774197102417.2783,
			name: "Period.csv",
			size: 131,
			typeId: "object"
		},
		{
			id: "7noMWibUuBnyasARrwKzS",
			lastModifiedAt: 1774197102417.332,
			name: "PersonalizationResource.csv",
			size: 157,
			typeId: "object"
		},
		{
			id: "B6FjqHjcn3m50SQ6u9JQk",
			lastModifiedAt: 1774197102417.3867,
			name: "PersonalizedUnswdQuestion.csv",
			size: 213,
			typeId: "object"
		},
		{
			id: "v_nmAZIXSVqUn8JEHu8xd",
			lastModifiedAt: 1774197102417.449,
			name: "Pricebook2.csv",
			size: 487,
			typeId: "object"
		},
		{
			id: "XTtiuMElXxs6maH8x_-HB",
			lastModifiedAt: 1774197102417.523,
			name: "PricebookEntry.csv",
			size: 6815,
			typeId: "object"
		},
		{
			id: "7OK9SYYTaKLxRuIVxKu7z",
			lastModifiedAt: 1774197102417.5872,
			name: "ProcessInstance.csv",
			size: 210,
			typeId: "object"
		},
		{
			id: "ZLl3QrFFUTeoy_XBza79w",
			lastModifiedAt: 1774197102417.6597,
			name: "ProcessInstanceNode.csv",
			size: 186,
			typeId: "object"
		},
		{
			id: "FBg1jTWD48r1KImApvuXD",
			lastModifiedAt: 1774197102417.725,
			name: "ProcessInstanceStep.csv",
			size: 223,
			typeId: "object"
		},
		{
			id: "vLY9qAdx1n-trUvs3-Xcx",
			lastModifiedAt: 1774197102417.791,
			name: "ProcessInstanceWorkitem.csv",
			size: 256,
			typeId: "object"
		},
		{
			id: "7LbHq4pzVJEsKUKax-sm1",
			lastModifiedAt: 1774197102417.8447,
			name: "Product2.csv",
			size: 3569,
			typeId: "object"
		},
		{
			id: "DLQmioL8Ord5FQbUUS70o",
			lastModifiedAt: 1774197102417.8955,
			name: "PushIntent.csv",
			size: 170,
			typeId: "object"
		},
		{
			id: "NsgWm1vX4tdCnoic6Xnum",
			lastModifiedAt: 1774197102417.942,
			name: "PushProfileMapping.csv",
			size: 180,
			typeId: "object"
		},
		{
			id: "e9HWNZChNL5_8SfuNvFF0",
			lastModifiedAt: 1774197102417.9973,
			name: "QuickText.csv",
			size: 148,
			typeId: "object"
		},
		{
			id: "TIqfsf23FjsGZhlfbS13G",
			lastModifiedAt: 1774197102418.05,
			name: "RecommendationAudience.csv",
			size: 183,
			typeId: "object"
		},
		{
			id: "yIvpS1AFb3SwyD4cPDxKr",
			lastModifiedAt: 1774197102418.104,
			name: "RecommendationDefinition.csv",
			size: 213,
			typeId: "object"
		},
		{
			id: "RJO3RZBZVO7kyyclHruWI",
			lastModifiedAt: 1774197102418.1553,
			name: "RecommendationMetric.csv",
			size: 238,
			typeId: "object"
		},
		{
			id: "KY2mXDUivZmoDmJhmCL5y",
			lastModifiedAt: 1774197102418.2048,
			name: "RecordAction.csv",
			size: 179,
			typeId: "object"
		},
		{
			id: "MrCZjNe-nlm_wIU05CJgE",
			lastModifiedAt: 1774197102418.252,
			name: "RecordOrigin.csv",
			size: 168,
			typeId: "object"
		},
		{
			id: "HMOS9favWGXarfM90h56D",
			lastModifiedAt: 1774197102418.3025,
			name: "RecordType.csv",
			size: 1730,
			typeId: "object"
		},
		{
			id: "HjodpnoCIz7ZQcTXWraQP",
			lastModifiedAt: 1774197102418.3577,
			name: "Scorecard.csv",
			size: 146,
			typeId: "object"
		},
		{
			id: "yynVqDCZ9fVuBH9vbi7Xj",
			lastModifiedAt: 1774197102418.4106,
			name: "ScorecardAssociation.csv",
			size: 138,
			typeId: "object"
		},
		{
			id: "kwXLFpFn4TiG3o2kmhJnW",
			lastModifiedAt: 1774197102418.4658,
			name: "ScorecardMetric.csv",
			size: 157,
			typeId: "object"
		},
		{
			id: "Ipxng_Dq10Op02vouWGLf",
			lastModifiedAt: 1774197102418.52,
			name: "SearchActivity.csv",
			size: 245,
			typeId: "object"
		},
		{
			id: "vDb7gxfeRhZ3-AblIWVuK",
			lastModifiedAt: 1774197102418.571,
			name: "SearchPromotionRule.csv",
			size: 115,
			typeId: "object"
		},
		{
			id: "_Rcn9mWbVYJ7D28_xo7WD",
			lastModifiedAt: 1774197102418.6345,
			name: "SetupAssistantAnswer.csv",
			size: 130,
			typeId: "object"
		},
		{
			id: "NtPCO09FQ7G1DG7Ce_aAj",
			lastModifiedAt: 1774197102418.6946,
			name: "SetupAssistantProgress.csv",
			size: 143,
			typeId: "object"
		},
		{
			id: "NDBI284AB9Qah1RNO1ag2",
			lastModifiedAt: 1774197102418.7617,
			name: "SetupFlowProgress.csv",
			size: 265,
			typeId: "object"
		},
		{
			id: "lGyl1WHjhJil6SB8AYwz9",
			lastModifiedAt: 1774197102418.8193,
			name: "SocialPersona.csv",
			size: 200,
			typeId: "object"
		},
		{
			id: "h-R6-HJRr_6fygTP4RRAO",
			lastModifiedAt: 1774197102418.8784,
			name: "Solution.csv",
			size: 5877,
			typeId: "object"
		},
		{
			id: "J1TMSAeG-oAc1Olh7VYgs",
			lastModifiedAt: 1774197102418.9373,
			name: "StreamingChannel.csv",
			size: 143,
			typeId: "object"
		},
		{
			id: "-duon_B8bjW33Q8SEvRVZ",
			lastModifiedAt: 1774197102418.9917,
			name: "SystemStreamingChannel.csv",
			size: 133,
			typeId: "object"
		},
		{
			id: "mNNxpwjW-UuIPrvhsM9zo",
			lastModifiedAt: 1774197102419.0554,
			name: "Task.csv",
			size: 643,
			typeId: "object"
		},
		{
			id: "ozjWxdeFkeV1RxOLcWjWC",
			lastModifiedAt: 1774197102419.1055,
			name: "TaskRelation.csv",
			size: 143,
			typeId: "object"
		},
		{
			id: "tCKMENgHgyOC69qtnCf3T",
			lastModifiedAt: 1774197102419.1543,
			name: "TodayGoal.csv",
			size: 134,
			typeId: "object"
		},
		{
			id: "aBxNBJIN8VVW6p0XqaqnI",
			lastModifiedAt: 1774197102419.2139,
			name: "Tombstone.csv",
			size: 116,
			typeId: "object"
		},
		{
			id: "UuKO0i5wOaI23l8QyVzrc",
			lastModifiedAt: 1774197102419.2683,
			name: "TopicDataCategoryRule.csv",
			size: 156,
			typeId: "object"
		},
		{
			id: "C-YB6ietUr8JpC3JG1P6-",
			lastModifiedAt: 1774197102419.3206,
			name: "TopicGroupActivity.csv",
			size: 156,
			typeId: "object"
		},
		{
			id: "U4Kg6rfm8H3NUsGVTavv_",
			lastModifiedAt: 1774197102419.3738,
			name: "TopicUserActivity.csv",
			size: 142,
			typeId: "object"
		},
		{
			id: "cTPILZq_Ey-4DeVEBxuhg",
			lastModifiedAt: 1774197102419.4253,
			name: "TransitionMessage.csv",
			size: 134,
			typeId: "object"
		},
		{
			id: "wxWwDf_rdWx9wJ8TOAwKh",
			lastModifiedAt: 1774197102419.4714,
			name: "TrendingTopic.csv",
			size: 169,
			typeId: "object"
		},
		{
			id: "Rzr0GQZHaxlFAouyFDOp-",
			lastModifiedAt: 1774197102419.527,
			name: "User.csv",
			size: 4166,
			typeId: "object"
		},
		{
			id: "M74v-iBQwKFgF9U8J0_4Z",
			lastModifiedAt: 1774197102419.5823,
			name: "UserAppInfo.csv",
			size: 147,
			typeId: "object"
		},
		{
			id: "mG782ttpBsZGifT0kPyY-",
			lastModifiedAt: 1774197102419.64,
			name: "UserAppMenuCustomization.csv",
			size: 145,
			typeId: "object"
		},
		{
			id: "abaGOjFy6BDi-ubpTyiuF",
			lastModifiedAt: 1774197102419.6992,
			name: "UserMetrics.csv",
			size: 243,
			typeId: "object"
		},
		{
			id: "XHgOfjr1MYcdCjl_7YwrT",
			lastModifiedAt: 1774197102419.7551,
			name: "UserNavItem.csv",
			size: 229,
			typeId: "object"
		},
		{
			id: "uzU2GB378ye3oK6VpL5yF",
			lastModifiedAt: 1774197102419.8098,
			name: "UserProvAccount.csv",
			size: 283,
			typeId: "object"
		},
		{
			id: "QG9yn7QGdTe3WeZpD1x7d",
			lastModifiedAt: 1774197102419.8691,
			name: "UserProvAccountStaging.csv",
			size: 255,
			typeId: "object"
		},
		{
			id: "n0d-5fnwKGzjC6NgDZJLs",
			lastModifiedAt: 1774197102419.973,
			name: "UserProvisioningLog.csv",
			size: 199,
			typeId: "object"
		},
		{
			id: "UGJCY7XTognAN-YjoFiGC",
			lastModifiedAt: 1774197102420.0205,
			name: "UserProvisioningRequest.csv",
			size: 324,
			typeId: "object"
		},
		{
			id: "AOoHhDjrBhR1SpqG0ij6-",
			lastModifiedAt: 1774197102419.9194,
			name: "UserProvMockTarget.csv",
			size: 198,
			typeId: "object"
		},
		{
			id: "2VXQFU4WoFmwIPkoswdS2",
			lastModifiedAt: 1774197102420.0747,
			name: "UserRole.csv",
			size: 3826,
			typeId: "object"
		},
		{
			id: "76DQRWmhiriKthhvV790n",
			lastModifiedAt: 1774197102420.1287,
			name: "UserSetupAppInfo.csv",
			size: 129,
			typeId: "object"
		},
		{
			id: "Fy56QNs1Vc5wHHsadIfo8",
			lastModifiedAt: 1774197102420.1785,
			name: "WorkCoaching.csv",
			size: 152,
			typeId: "object"
		},
		{
			id: "JfGhJLzJr_JIONsvUDMMx",
			lastModifiedAt: 1774197102420.237,
			name: "WorkFeedback.csv",
			size: 153,
			typeId: "object"
		},
		{
			id: "PrcP2ibXfyd-P0bK3sTss",
			lastModifiedAt: 1774197102420.2942,
			name: "WorkFeedbackQuestion.csv",
			size: 233,
			typeId: "object"
		},
		{
			id: "_3lfvxRR1c1dp0S3_V8Vr",
			lastModifiedAt: 1774197102420.3499,
			name: "WorkFeedbackQuestionSet.csv",
			size: 163,
			typeId: "object"
		},
		{
			id: "48ccpOQy5wQgNZHA-DS3c",
			lastModifiedAt: 1774197102420.404,
			name: "WorkFeedbackRequest.csv",
			size: 417,
			typeId: "object"
		},
		{
			id: "yqOH97dyRgc0RE9-T9OwC",
			lastModifiedAt: 1774197102420.454,
			name: "WorkFeedbackTemplate.csv",
			size: 133,
			typeId: "object"
		},
		{
			id: "VjzvrCDhAsKIIK3HScEXa",
			lastModifiedAt: 1774197102420.5046,
			name: "WorkPerformanceCycle.csv",
			size: 199,
			typeId: "object"
		}
	],
	"/Test Files": [
		{
			childCount: 21,
			name: "Encoding",
			typeId: "folder"
		},
		{
			childCount: 31,
			name: "Encoding Test Files",
			typeId: "folder"
		},
		{
			id: "89KCFMxodwrEB5wIVLnw6",
			lastModifiedAt: 1774197102420.5967,
			name: "Categories.csv",
			size: 441,
			typeId: "object"
		},
		{
			id: "ve-f8ccP0xjB5Ms7NYebb",
			lastModifiedAt: 1774197102420.6536,
			name: "Conversion Data.csv",
			size: 5338,
			typeId: "object"
		},
		{
			id: "yw4N3kTho2gG3Tzfg9d1q",
			lastModifiedAt: 1774197102420.7588,
			name: "Customers.csv",
			size: 13295,
			typeId: "object"
		},
		{
			id: "Ivwkutmc_uIlgPkkG4jEu",
			lastModifiedAt: 1774197102425.7937,
			name: "Receipts.xls",
			size: 180736,
			typeId: "object"
		},
		{
			id: "V8StQyBMlSmGgEDzswyIl",
			lastModifiedAt: 1774197102425.8591,
			name: "test.csv",
			size: 2995,
			typeId: "object"
		},
		{
			id: "ExQIBBZw8Y9yTR-vSOhqR",
			lastModifiedAt: 1774197102425.9285,
			name: "test.json",
			size: 7906,
			typeId: "object"
		},
		{
			id: "00fCkpIXxu9YIe5lNaKSv",
			lastModifiedAt: 1774197102425.981,
			name: "test.spss",
			size: 17,
			typeId: "object"
		},
		{
			id: "xEXGtVleY93AwM681jy1V",
			lastModifiedAt: 1774197102426.0361,
			name: "test.xls",
			size: 16,
			typeId: "object"
		},
		{
			id: "r1AW1PU6oU1vgEYK3WR_z",
			lastModifiedAt: 1774197102426.0918,
			name: "test.xlsx",
			size: 17,
			typeId: "object"
		},
		{
			id: "xVDWnuMbcFXYGGigpuJ6V",
			lastModifiedAt: 1774197102426.1528,
			name: "test.xml",
			size: 4429,
			typeId: "object"
		}
	],
	"/Test Files/Encoding": [
		{
			id: "6Qy_N6ho70IWR3_9yLyr_",
			lastModifiedAt: 1774197102424.4604,
			name: "big5",
			size: 614,
			typeId: "object"
		},
		{
			id: "Za2SCGh0laImxy7om9gBR",
			lastModifiedAt: 1774197102424.5173,
			name: "euc-jp",
			size: 3919,
			typeId: "object"
		},
		{
			id: "hhTW7Z1MUXNS8ezy0vCcU",
			lastModifiedAt: 1774197102424.5715,
			name: "euc-kr",
			size: 2480,
			typeId: "object"
		},
		{
			id: "R8PXuYtVTSa54Bs6k0grQ",
			lastModifiedAt: 1774197102424.6313,
			name: "gb18030",
			size: 1665,
			typeId: "object"
		},
		{
			id: "v6U3xvm5AvctHxcjdyktB",
			lastModifiedAt: 1774197102424.687,
			name: "iso-2022-jp",
			size: 2924,
			typeId: "object"
		},
		{
			id: "HpCuTSikkVk_Z1p098xlo",
			lastModifiedAt: 1774197102424.7373,
			name: "iso-8859-2",
			size: 1600,
			typeId: "object"
		},
		{
			id: "bgWGr7S3IxjvQUnejSd-h",
			lastModifiedAt: 1774197102424.788,
			name: "iso-8859-5",
			size: 1024,
			typeId: "object"
		},
		{
			id: "EHRgJIzKY36eIfznUYUBC",
			lastModifiedAt: 1774197102424.8372,
			name: "iso-8859-6",
			size: 2241,
			typeId: "object"
		},
		{
			id: "tvzVRvAZlp9af10MLxKwh",
			lastModifiedAt: 1774197102424.8887,
			name: "iso-8859-7",
			size: 1033,
			typeId: "object"
		},
		{
			id: "1PJNdJruzruhpJUTZy0E5",
			lastModifiedAt: 1774197102424.939,
			name: "koi8-r",
			size: 1024,
			typeId: "object"
		},
		{
			id: "strgbEVDTm9tfyp_8yxao",
			lastModifiedAt: 1774197102424.9922,
			name: "shift_jis",
			size: 2816,
			typeId: "object"
		},
		{
			id: "Mn_6SrE3sRFS61XdzzW9A",
			lastModifiedAt: 1774197102425.036,
			name: "utf-16be",
			size: 1334,
			typeId: "object"
		},
		{
			id: "QBxTeZVL8UhFazTX0X0ib",
			lastModifiedAt: 1774197102425.0786,
			name: "utf-16le",
			size: 1334,
			typeId: "object"
		},
		{
			id: "mrmBQed5jTieAFTvI0dRo",
			lastModifiedAt: 1774197102425.127,
			name: "utf-8",
			size: 1125,
			typeId: "object"
		},
		{
			id: "AmaEeTwXSA26WFDCF5PlN",
			lastModifiedAt: 1774197102425.179,
			name: "windows-1250",
			size: 1617,
			typeId: "object"
		},
		{
			id: "U8xj3zSLj5mEftb97YFYj",
			lastModifiedAt: 1774197102425.2297,
			name: "windows-1251",
			size: 1024,
			typeId: "object"
		},
		{
			id: "-PUyLKd0J_iswfGTI8Mvt",
			lastModifiedAt: 1774197102425.2805,
			name: "windows-1252",
			size: 2976,
			typeId: "object"
		},
		{
			id: "zOmcg4XhFTAdnQ_PZjURn",
			lastModifiedAt: 1774197102425.332,
			name: "windows-1253",
			size: 1052,
			typeId: "object"
		},
		{
			id: "XKV4eUi7CLLncWJW-Uge4",
			lastModifiedAt: 1774197102425.3872,
			name: "windows-1254",
			size: 2445,
			typeId: "object"
		},
		{
			id: "BGa6lPSIUVtpxSZpF5myX",
			lastModifiedAt: 1774197102425.439,
			name: "windows-1255",
			size: 2405,
			typeId: "object"
		},
		{
			id: "d5naW_4xBdTDMhtvAWIWP",
			lastModifiedAt: 1774197102425.4978,
			name: "windows-1256",
			size: 2241,
			typeId: "object"
		}
	],
	"/Test Files/Encoding Test Files": [
		{
			childCount: 38,
			name: "encodings",
			typeId: "folder"
		},
		{
			id: "ECQoenS1NvMNZ5xIQiRu9",
			lastModifiedAt: 1774197102420.8447,
			name: "ascii.txt",
			size: 44,
			typeId: "object"
		},
		{
			id: "ToX-QJC_cAdoYdJijaLYt",
			lastModifiedAt: 1774197102420.8987,
			name: "big5.txt",
			size: 37,
			typeId: "object"
		},
		{
			id: "HwppNOaMkxfJ8sNRUsjdB",
			lastModifiedAt: 1774197102423.0383,
			name: "euc-jp.txt",
			size: 218,
			typeId: "object"
		},
		{
			id: "JTEh3Zud6XTpb2gNWAuhA",
			lastModifiedAt: 1774197102423.09,
			name: "euc-kr.txt",
			size: 153,
			typeId: "object"
		},
		{
			id: "rc45J0xvGN-M26LRtCJ9w",
			lastModifiedAt: 1774197102423.1362,
			name: "gb2312.txt",
			size: 105,
			typeId: "object"
		},
		{
			id: "wOMvqBP8ucCJDV1hRi8VO",
			lastModifiedAt: 1774197102423.1863,
			name: "hz-gb-2312.txt",
			size: 117,
			typeId: "object"
		},
		{
			id: "SSPDpVXYb0rMnlBAuwo71",
			lastModifiedAt: 1774197102423.2385,
			name: "ibm855.txt",
			size: 290,
			typeId: "object"
		},
		{
			id: "I4jL08j4fL5xd8iCbm0KT",
			lastModifiedAt: 1774197102423.2866,
			name: "ibm866.txt",
			size: 290,
			typeId: "object"
		},
		{
			id: "q0vb4XqzSmQsnuBpwhPzt",
			lastModifiedAt: 1774197102423.3406,
			name: "iso-2022-jp.txt",
			size: 224,
			typeId: "object"
		},
		{
			id: "D7cWxz0uih0jKX57AwcnY",
			lastModifiedAt: 1774197102423.399,
			name: "iso-2022-kr.txt",
			size: 198,
			typeId: "object"
		},
		{
			id: "Zk81lhUrjBaDpSxavrSNQ",
			lastModifiedAt: 1774197102423.4585,
			name: "iso-8859-2.txt",
			size: 273,
			typeId: "object"
		},
		{
			id: "l1S3hQwiTWW50r-yTCvuM",
			lastModifiedAt: 1774197102423.5107,
			name: "iso-8859-5-bulgarian.txt",
			size: 304,
			typeId: "object"
		},
		{
			id: "zl4QwRP5BgVy1lTZ_JjEM",
			lastModifiedAt: 1774197102423.5645,
			name: "iso-8859-5-russian.txt",
			size: 290,
			typeId: "object"
		},
		{
			id: "mrV2yLu-JpyMHgO6KPe5h",
			lastModifiedAt: 1774197102423.6143,
			name: "iso-8859-7.txt",
			size: 319,
			typeId: "object"
		},
		{
			id: "Mf4VTGiFa_qJi3W059EWt",
			lastModifiedAt: 1774197102423.6628,
			name: "iso-8859-8.txt",
			size: 307,
			typeId: "object"
		},
		{
			id: "IofYVzGby8MGCf7Ao2pi6",
			lastModifiedAt: 1774197102423.7102,
			name: "koi8-r.txt",
			size: 290,
			typeId: "object"
		},
		{
			id: "modmR0aaiADIkHGme_gKH",
			lastModifiedAt: 1774197102423.7559,
			name: "shift_jis.txt",
			size: 216,
			typeId: "object"
		},
		{
			id: "z94o2ojmVcTCiw111--FH",
			lastModifiedAt: 1774197102423.8025,
			name: "tis-620.txt",
			size: 68,
			typeId: "object"
		},
		{
			id: "KD6YoMwOGuNga6TbndJBh",
			lastModifiedAt: 1774197102423.85,
			name: "utf-16be.txt",
			size: 2,
			typeId: "object"
		},
		{
			id: "CfhNhMa2oZ-x1oWBJoP5I",
			lastModifiedAt: 1774197102423.9001,
			name: "utf-16le.txt",
			size: 84,
			typeId: "object"
		},
		{
			id: "yAjqKF0ST7On-WVTY2wIn",
			lastModifiedAt: 1774197102423.9463,
			name: "utf-32be.txt",
			size: 4,
			typeId: "object"
		},
		{
			id: "IXuTXHbTkbtziKdesMZQa",
			lastModifiedAt: 1774197102423.993,
			name: "utf-32le.txt",
			size: 18,
			typeId: "object"
		},
		{
			id: "vNubvuaxtfNnPG6iKAoHX",
			lastModifiedAt: 1774197102424.0396,
			name: "utf-8-with-bom.txt",
			size: 58,
			typeId: "object"
		},
		{
			id: "Cd-qwY9iLLDXhyVCWrZxh",
			lastModifiedAt: 1774197102424.0862,
			name: "utf-8-without-bom.txt",
			size: 58,
			typeId: "object"
		},
		{
			id: "FH6ZD-39z_GNvFwWXJw4y",
			lastModifiedAt: 1774197102424.1333,
			name: "windows-1251.txt",
			size: 290,
			typeId: "object"
		},
		{
			id: "acgQb_4_Q2mzoWwjLcMAP",
			lastModifiedAt: 1774197102424.1824,
			name: "windows-1252.txt",
			size: 433,
			typeId: "object"
		},
		{
			id: "rXIh_5xiZDxqF8zJ7ZsJv",
			lastModifiedAt: 1774197102424.2275,
			name: "windows-1255.txt",
			size: 36,
			typeId: "object"
		},
		{
			id: "Y1CbKA0ulTwvKpc90DKUK",
			lastModifiedAt: 1774197102424.2761,
			name: "x-iso-10646-ucs-4-2143.txt",
			size: 20,
			typeId: "object"
		},
		{
			id: "2JOajterWyfY4D_0QUxs3",
			lastModifiedAt: 1774197102424.325,
			name: "x-iso-10646-ucs-4-3412.txt",
			size: 20,
			typeId: "object"
		},
		{
			id: "K2kjUj4-E2H92J-DIpiIl",
			lastModifiedAt: 1774197102424.377,
			name: "x-mac-cyrillic.txt",
			size: 290,
			typeId: "object"
		}
	],
	"/Test Files/Encoding Test Files/encodings": [
		{
			id: "PfB5CPGx4Ay0PTmA9MzzQ",
			lastModifiedAt: 1774197102420.993,
			name: "big5",
			size: 614,
			typeId: "object"
		},
		{
			id: "nyi8RdjOWuUnABS3XmeiG",
			lastModifiedAt: 1774197102421.0579,
			name: "euc_jp",
			size: 3919,
			typeId: "object"
		},
		{
			id: "eKaGMTTilz_cMODunj7og",
			lastModifiedAt: 1774197102421.114,
			name: "euc_kr",
			size: 2480,
			typeId: "object"
		},
		{
			id: "rYWsGnP0z_pU2ij-D7LUn",
			lastModifiedAt: 1774197102421.1719,
			name: "gb18030",
			size: 1665,
			typeId: "object"
		},
		{
			id: "iLWX-XsWcdm2Qug2cir0F",
			lastModifiedAt: 1774197102421.226,
			name: "iso2022cn",
			size: 1749,
			typeId: "object"
		},
		{
			id: "s2rU9x8zgf3bxeZ8IioDC",
			lastModifiedAt: 1774197102421.2817,
			name: "iso2022jp",
			size: 2924,
			typeId: "object"
		},
		{
			id: "7W_U8uovDcFq2V_wvhSgp",
			lastModifiedAt: 1774197102421.3335,
			name: "iso2022kr",
			size: 3172,
			typeId: "object"
		},
		{
			id: "_lGuHaz6-bbFaSnsAVyLJ",
			lastModifiedAt: 1774197102421.3872,
			name: "iso88591_en",
			size: 2955,
			typeId: "object"
		},
		{
			id: "X5aZa3a7rLt-C0uPdOGaN",
			lastModifiedAt: 1774197102421.4385,
			name: "iso88592_cs",
			size: 1600,
			typeId: "object"
		},
		{
			id: "NLow0TYN2dwzyqsCEMB3a",
			lastModifiedAt: 1774197102421.4897,
			name: "iso88595_ru",
			size: 1024,
			typeId: "object"
		},
		{
			id: "8pMWGGzJap4ys3Qtx65q6",
			lastModifiedAt: 1774197102421.5425,
			name: "iso88596_ar",
			size: 2241,
			typeId: "object"
		},
		{
			id: "KBLiOMjpBjHDqMjCp8smM",
			lastModifiedAt: 1774197102421.6028,
			name: "iso88597_el",
			size: 1033,
			typeId: "object"
		},
		{
			id: "XTyTC3F2TljLfWkfHGliU",
			lastModifiedAt: 1774197102421.6587,
			name: "iso88598",
			size: 2352,
			typeId: "object"
		},
		{
			id: "dMaT7xgMMhotuy-Nv91w7",
			lastModifiedAt: 1774197102421.7097,
			name: "iso88598_he",
			size: 2353,
			typeId: "object"
		},
		{
			id: "mTFB01GNhMG7HaNLIPYc2",
			lastModifiedAt: 1774197102421.761,
			name: "iso88599_tr",
			size: 2424,
			typeId: "object"
		},
		{
			id: "lQ1CNY2BHX3IyMuXC0gls",
			lastModifiedAt: 1774197102421.8125,
			name: "koi8r",
			size: 1024,
			typeId: "object"
		},
		{
			id: "s8dBHmOH2ow64_x9okreo",
			lastModifiedAt: 1774197102421.8665,
			name: "lang_arabic",
			size: 4059,
			typeId: "object"
		},
		{
			id: "hLTTRhuGFPSwEd_MbqRL9",
			lastModifiedAt: 1774197102421.92,
			name: "lang_chinese",
			size: 916,
			typeId: "object"
		},
		{
			id: "vg_n979zkm6Dfb-t8qtoW",
			lastModifiedAt: 1774197102421.9744,
			name: "lang_czech",
			size: 1795,
			typeId: "object"
		},
		{
			id: "2MYoPqH_1oJthQ2Z51wYW",
			lastModifiedAt: 1774197102422.034,
			name: "lang_greek",
			size: 1895,
			typeId: "object"
		},
		{
			id: "A6OlL2Vl4Ywzjre4GsptO",
			lastModifiedAt: 1774197102422.095,
			name: "lang_hebrew",
			size: 4124,
			typeId: "object"
		},
		{
			id: "zzTk_D8zl5TFZRdllq7Ap",
			lastModifiedAt: 1774197102422.1545,
			name: "lang_japanese",
			size: 3978,
			typeId: "object"
		},
		{
			id: "8nDuoiwaMApSN39yfG7aF",
			lastModifiedAt: 1774197102422.2073,
			name: "lang_korean",
			size: 3466,
			typeId: "object"
		},
		{
			id: "3OCTKsi-o45P5DAe6kSx3",
			lastModifiedAt: 1774197102422.2593,
			name: "lang_russian",
			size: 1873,
			typeId: "object"
		},
		{
			id: "TDLZ30na1ZzqBzu6SBI2C",
			lastModifiedAt: 1774197102422.3152,
			name: "lang_turkish",
			size: 2678,
			typeId: "object"
		},
		{
			id: "xX3CsRFcuocifzY4yCrEb",
			lastModifiedAt: 1774197102422.3694,
			name: "shiftjis",
			size: 2816,
			typeId: "object"
		},
		{
			id: "rq3Pmlu-5xTWUudes3Ff6",
			lastModifiedAt: 1774197102422.4211,
			name: "utf16be",
			size: 1334,
			typeId: "object"
		},
		{
			id: "265I-BCuIufL-AxO6grDk",
			lastModifiedAt: 1774197102422.4663,
			name: "utf16le",
			size: 1334,
			typeId: "object"
		},
		{
			id: "5-Od36qnO9lXNXgDlUCHE",
			lastModifiedAt: 1774197102422.5188,
			name: "utf32be",
			size: 2664,
			typeId: "object"
		},
		{
			id: "eOVnPEAFsNJI47uXuAFhe",
			lastModifiedAt: 1774197102422.572,
			name: "utf32le",
			size: 2664,
			typeId: "object"
		},
		{
			id: "6K1hav_ZjBfx8lhLD7JPx",
			lastModifiedAt: 1774197102422.628,
			name: "utf8",
			size: 1125,
			typeId: "object"
		},
		{
			id: "fLxUkGpvk8IQwTcGFxQEA",
			lastModifiedAt: 1774197102422.6814,
			name: "windows_1250",
			size: 1617,
			typeId: "object"
		},
		{
			id: "BTTAkfpU7LjF1VprcxeG9",
			lastModifiedAt: 1774197102422.7307,
			name: "windows_1251",
			size: 1024,
			typeId: "object"
		},
		{
			id: "9c7Zaxv1BipO1AMalcffG",
			lastModifiedAt: 1774197102422.7815,
			name: "windows_1252",
			size: 2976,
			typeId: "object"
		},
		{
			id: "IJjXIRTIoD75YoyJ3_J-i",
			lastModifiedAt: 1774197102422.8298,
			name: "windows_1253",
			size: 1052,
			typeId: "object"
		},
		{
			id: "lcPHgG9L1S3eXxLWmUpSq",
			lastModifiedAt: 1774197102422.883,
			name: "windows_1254",
			size: 2445,
			typeId: "object"
		},
		{
			id: "14DtFYRTs6xw5XioEEsta",
			lastModifiedAt: 1774197102422.936,
			name: "windows_1255",
			size: 2405,
			typeId: "object"
		},
		{
			id: "zjcaXlyHWryPihajklB2P",
			lastModifiedAt: 1774197102422.9895,
			name: "windows_1256",
			size: 2241,
			typeId: "object"
		}
	]
}, S = "https://sample-data-eu.dpuse.app/fileStore", C = class {
	abortController;
	config;
	connectorUtilities;
	toolConfigs;
	constructor(e, t) {
		this.abortController = void 0, this.config = b, this.connectorUtilities = e, this.toolConfigs = t;
	}
	abortOperation() {
		this.abortController &&= (this.abortController.abort(), void 0);
	}
	async auditObjectContent(e, t) {
		this.abortController = new AbortController();
		try {
			if (e.parsingToolName === "dpuse-tool-rust-csv-core") {
				let n = await this.getReadableStream({
					id: "",
					path: e.path
				}), r = await _(this.toolConfigs, "rust-csv-core"), i = {
					delimiter: ",",
					hasHeaders: !0
				}, a = e.supportsTransferableStreams ? await r.processWithTransferableStream(n, i, t) : await r.processWithChunks(n, i, t);
				return {
					processedRowCount: a.processedRowCount,
					durationMs: a.durationMs ?? 0
				};
			}
			let n = await _(this.toolConfigs, "csv-parse"), r = {
				delimiter: e.valueDelimiterId,
				relax_column_count: !0,
				relax_quotes: !0
			}, i = `${S}${e.path}`, a = await n.parseStream(e, r, i, this.abortController, (e) => {
				console.log(e);
			});
			return console.log("summary", a), {
				processedRowCount: 0,
				durationMs: 0
			};
		} catch (e) {
			throw d(e);
		} finally {
			this.abortController = void 0;
		}
	}
	findObject(e) {
		let t = x;
		for (let n in t) if (Object.hasOwn(t, n) && t[n]?.find((t) => t.typeId === "object" && t.id === e.nodeId)) return Promise.resolve({
			path: n,
			object: void 0
		});
		return Promise.reject(/* @__PURE__ */ Error("Not found."));
	}
	async getReadableStream(e) {
		let { signal: t } = this.abortController = new AbortController();
		try {
			let n = await fetch(`${S}${e.path}`, { signal: t });
			if (!n.ok) throw await u(n, `Failed to fetch '${e.path}' file.`, "dpuse-connector-file-store-emulator|Connector|getReadableStream");
			if (n.body == null) throw new c("Readable streams are not supported in this runtime.", "dpuse-connector-file-store-emulator|Connector|getReadableStream.unsupported");
			let a = await r(12, 56), o = await i(this.config.version);
			return console.log("sum", o, a), await Promise.resolve(n.body);
		} catch (e) {
			throw d(e);
		} finally {
			this.abortController = void 0;
		}
	}
	listNodes(e) {
		let t = x[e.folderPath] ?? [], n = [];
		for (let r of t) r.typeId === "folder" ? n.push(w(e.folderPath, r.name, r.childCount)) : n.push(T(e.folderPath, r.id, r.name, r.lastModifiedAt, r.size));
		return Promise.resolve({
			cursor: void 0,
			isMore: !1,
			connectionNodeConfigs: n,
			totalCount: n.length
		});
	}
	async previewObject(e) {
		let { signal: t } = this.abortController = new AbortController();
		try {
			let n = Date.now(), r = performance.now(), i = await (await _(this.toolConfigs, "file-operators")).previewFile(`${S}${e.path}`, t, e.chunkSize);
			if (i.dataFormatId == null) throw Error(`File '${e.path}' has unknown type.`);
			if (i.text == null) throw Error(`File '${e.path}' is empty.`);
			let a = await (await _(this.toolConfigs, "csv-parse")).parseText(i.text, y), o = this.connectorUtilities.inferDataTypes(a.parsedRecords);
			return {
				asAt: n,
				columnConfigs: o.columnConfigs,
				dataFormatId: i.dataFormatId,
				duration: performance.now() - r,
				encodingId: i.encodingId,
				encodingConfidenceLevel: i.encodingConfidenceLevel,
				fileType: i.fileTypeConfig,
				hasHeaders: o.hasHeaderRow,
				recordDelimiterId: a.recordDelimiterId,
				parsedRecords: a.parsedRecords,
				inferenceRecords: o.typedRecords,
				size: i.bytes.length,
				text: i.text,
				valueDelimiterId: a.valueDelimiterId
			};
		} catch (e) {
			throw d(e);
		} finally {
			this.abortController = void 0;
		}
	}
	async retrieveRecords(e, t, n) {
		this.abortController = new AbortController();
		try {
			let r = await _(this.toolConfigs, "csv-parse"), i = {
				delimiter: e.valueDelimiterId,
				info: !0,
				relax_column_count: !0,
				relax_quotes: !0
			}, a = `${S}${e.path}`;
			n(await r.parseStream(e, i, a, this.abortController, t));
		} catch (e) {
			throw d(e);
		} finally {
			this.abortController = void 0;
		}
	}
};
function w(e, n, r) {
	return {
		childCount: r,
		childNodes: [],
		extension: void 0,
		folderPath: e,
		handle: void 0,
		id: t(),
		label: n,
		lastModifiedAt: void 0,
		mimeType: void 0,
		name: n,
		size: void 0,
		typeId: "folder"
	};
}
function T(e, t, n, r, i) {
	let a = p(n) ?? "", o = m(n);
	return {
		childCount: void 0,
		childNodes: [],
		extension: o,
		folderPath: e,
		handle: void 0,
		id: t,
		label: n,
		lastModifiedAt: r,
		mimeType: h(o),
		name: a,
		size: i,
		typeId: "object"
	};
}
//#endregion
export { C as Connector };

//# sourceMappingURL=dpuse-connector-file-store-emulator.es.js.map