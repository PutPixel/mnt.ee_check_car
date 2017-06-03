var autoRegNumberTr = ".field-reg_nr";
var vinNumberTr = ".field-tehasetahis";

function onPageChanged() {
	var autoRegNumber = findAutoRegNumber();
	var autoVinNumber = findAutoVinNumber();
	if (autoRegNumber && autoVinNumber) {
		console.log("Add check by reg and vin number");
		var marker = buildClassMarker("regandvin");
		if (noMarker(marker)) {
			$("<tr>" +
				"<td class='label'>mnt.ee:</td>" +
				"<td class='value'>" +
				"<a class='" + marker + "' " +
				"href='" + buildCheckCarLink(autoRegNumber, autoVinNumber) + "'>" + chrome.i18n.getMessage("checkByRegAndVinNumbers") + "</a></td>" +
				"</tr>").insertAfter($(vinNumberTr));
		}
	}
}

function findAutoRegNumber() {
	return findNumberAndAddLinkToCheck(autoRegNumberTr, "REG", "checkByRegNumberOnly", function (autoRegNumber) {
		return buildCheckCarLink(autoRegNumber, null);
	});
}

function findAutoVinNumber() {

	return findNumberAndAddLinkToCheck(vinNumberTr, "VIN", "checkByVinNumberOnly", function (autoVinNumber) {
		return buildCheckCarLink(null, autoVinNumber);
	});
}

function buildClassMarker(uniqueIdentifier) {
	return "auto24mnteecheck" + uniqueIdentifier;
}

function noMarker(classMarker) {
	return !$("." + classMarker).exists();
}
function findNumberAndAddLinkToCheck(baseTagElement, tagType, localizeMsg, linkByValueBuilder) {
	var classMarker = buildClassMarker(tagType);
	var autoNumber = null;
	var numberTr = $(baseTagElement);
	if (numberTr.exists()) {
		if (numberTr.find(".preview").exists() || numberTr.find(".service-trigger").exists()) {
			console.trace("Preview of " + tagType + " number loaded, nothing to do here");
		} else {
			var numberValueSpan = numberTr.find(".value");
			if (numberValueSpan.exists()) {
				autoNumber = numberValueSpan.text();
				if (noMarker(classMarker)) {
					console.log("Real " + tagType + " number loaded, number: " + autoNumber);
					$("<br><a class='" + classMarker + "' href='" + linkByValueBuilder(autoNumber) + "'>" + chrome.i18n.getMessage(localizeMsg) + "</a>")
						.insertAfter(numberValueSpan);
				}
			}
		}
	}
	return autoNumber
}


function buildCheckCarLink(regNumber, vin) {
	var base = "https://eteenindus.mnt.ee/public/soidukTaustakontroll.jsf?1=1";
	if (regNumber) {
		base += "&regMark=" + regNumber
	}
	if (vin) {
		base += "&vin=" + vin
	}
	return base
}


$.fn.exists = function () {
	return this.length !== 0;
};

MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

var observer = new MutationObserver(function (mutations, observer) {
	onPageChanged()
});

observer.observe(document, {
	subtree: true,
	attributes: true
});


console.log("Extension loaded on page");
