angular.module('app.bupthq.inProcessing')
    .factory("InProcessingService", ['ApiBupthqInProcessing', 'EnvBupthq', '$http', function (api, env, $http) {
        var inProcessingListToday = [],
            inProcessingListBefore = [],
            pageIndex = 0,
            pageSize = 10,
            hasNextPage = true,
            condition = {
                type: 0,
                typeName: "不限",
                title: ""
            };

        return {
            loadListData: function (successCallBack) {
                var self = this,
                    searchFilter = this.getSearchFilter();

                ++pageIndex;
                $http.post(env.server + api.inProcessingList, {idx: self.getPageIndex(), pageSize: pageSize, search: JSON.stringify(searchFilter)}).success(function (data) {
                    self.loadListDataCallback(data);
                    successCallBack();
                });
            },
            refreshListData: function (successCallBack) {
                this.resetCondition();
                this.resetCachedData();
                this.loadListData(successCallBack);
            },
            resetCachedData: function () {
                this.setPageIndex(0);
                this.setHasNextPage(true);
                this.setInProcessingListBefore([]);
                this.setInProcessingListToday([]);
            },
            loadListDataCallback: function (data) {
                var pageInfo = data.object,
                    today = new Date().format("yyyy-MM-dd");

                for (var i = 0; i < pageInfo.items.length; i++) {
                    //区分数据是今天的数据还是以往的数据
                    if (today == new Date(pageInfo.items[i].currentStateDate).format('yyyy-MM-dd')) {
                        inProcessingListToday.push(pageInfo.items[i]);
                    } else {
                        inProcessingListBefore.push(pageInfo.items[i]);
                    }
                }

                if (pageIndex >= pageInfo.pageCount) {
                    hasNextPage = false;
                } else {
                    hasNextPage = true;
                }
            },
            getCondition: function () {
                return condition;
            },
            resetCondition: function () {
                condition.type = 0;
                condition.typeName = "不限";
                condition.title = "";
                return condition;
            },
            getSearchFilter: function () {
                var type = condition.type;
                var title = condition.title;
                return {type: type, title: title};
            },
            setInProcessingListToday: function (_inProcessingListToday) {
                inProcessingListToday = _inProcessingListToday;
            },
            getInProcessingListToday: function () {
                return inProcessingListToday;
            },
            getInProcessingListBefore: function () {
                return inProcessingListBefore;
            },
            setInProcessingListBefore: function (_inProcessingListBefore) {
                inProcessingListBefore = _inProcessingListBefore;
            },
            setPageIndex: function (_pageIndex) {
                pageIndex = _pageIndex;
            },
            getPageIndex: function () {
                return pageIndex;
            },
            hasNextPage: function () {
                return hasNextPage;
            },
            setHasNextPage: function (_hasNextPage) {
                hasNextPage = _hasNextPage;
            }
        }
    }]);
