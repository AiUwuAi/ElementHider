function SaveWords() {
  let currentWords = $("#keywords").val();
  chrome.storage.sync
    .set({
      words: currentWords,
    })
    .then(
      () => {
        $("#maxCharError").text("");
      },
      (e) => {
        chrome.storage.sync.get("words").then((savedWords) => {
          chrome.storage.sync.getBytesInUse().then((res) => {
            let used = res,
              wordSize = new Blob([savedWords.words]).size,
              availableBytes =
                chrome.storage.sync.QUOTA_BYTES_PER_ITEM - (used - wordSize);
            $("#maxCharError").text(
              "Maximum character amount exceeded! Keywords cannot be saved while character limit is not met. (" +
                new Blob([currentWords]).size +
                " / " +
                availableBytes +
                ")"
            );
          });
        });
      }
    );
}

function loadData() {
  chrome.storage.sync.get(
    ["enabled", "testingMode", "words"],
    function (result) {
      if (result.words != "        " || undefined)
        $("#keywords").val(result.words);
      else $("#keywords").value = "";
      $("#toggle").prop("checked", result.enabled);
      $("#toggleTesting").prop("checked", result.testingMode);
      onOff();
    }
  );
}

function onOff() {
  if ($("#toggle").prop("checked")) {
    $("#onoff")
      .css({
        color: "black",
      })
      .text("On");
    chrome.action.setBadgeText({
      text: "ON",
    });
    chrome.action.setBadgeBackgroundColor({
      color: "lime",
    });
  } else {
    $("#onoff")
      .css({
        color: "red",
      })
      .text("Off");
    chrome.action.setBadgeText({
      text: "OFF",
    });
    chrome.action.setBadgeBackgroundColor({
      color: "red",
    });
  }
}

function saveEnabled() {
  let enabled = $("#toggle").prop("checked");
  chrome.storage.sync.set({
    enabled: enabled,
  });
  onOff();
}

function saveTestingMode() {
  let testingMode = $("#toggleTesting").prop("checked");
  chrome.storage.sync.set({
    testingMode: testingMode,
  });
}

function Unsaved() {
  chrome.storage.sync.get("words", function (result) {
    if ($("#keywords").val() != result.words) {
      SaveWords();
    }
  });
}

function showExamples() {
  if (document.getElementById("help").innerText == "Show keyword examples") {
    $("#examples").fadeIn(500);
    $("#help").text("Hide keyword examples");
    $("body").animate(
      {
        scrollTop: $(document).height() - $(window).height(),
      },
      1400,
      "swing"
    );
  } else {
    $("#examples").slideUp(500);
    $("#help").text("Show keyword examples");
  }
}

function keywordEditor() {
  chrome.windows.create({
    url: chrome.runtime.getURL("src/browser_action/KeywordEditor.html"),
    type: "popup",
    width: 600,
    height: 400,
    focused: true,
  });
}

function showOptions() {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else window.open(chrome.runtime.getURL("options.html"));
}

$(document).ready(function () {
  loadData();
  $("#keywords").bind("input", Unsaved);
  $("#openKeywords").bind("click", keywordEditor);
  $("#save-btn").bind("click", SaveWords);
  $("#toggle").bind("change", saveEnabled);
  $("#toggleTesting").bind("change", saveTestingMode);
  $("#help").bind("click", showExamples);
  $("#optionsIcon").bind("click", showOptions);
  // Animations
  $("#logo").slideDown(250);
  $("#logoLine").fadeIn(2500);
  $("#wordLine").fadeIn(1000);
  $("#keywords").fadeIn(1000);
  $("#onoff").fadeIn(1200);
  $("#testingMode").fadeIn(1200);
  $("#help").fadeIn(2000);
});
