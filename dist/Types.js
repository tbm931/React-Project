export var status;
(function (status) {
    status[status["Scheduled"] = 0] = "Scheduled";
    status[status["Canceled"] = 1] = "Canceled";
    status[status["Completed"] = 2] = "Completed";
})(status || (status = {}));
