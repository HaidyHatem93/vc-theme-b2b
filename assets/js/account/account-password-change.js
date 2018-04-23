angular.module('storefront.account')
    .component('vcAccountPasswordChange', {
        templateUrl: "themes/assets/js/account/account-password-change.tpl.liquid",
        require: {
            accountManager: '^vcAccountManager'
        },
        controller: ['$scope', 'loadingIndicatorService', 'accountApi', function ($scope, loader, accountApi) {
            var $ctrl = this;
            $ctrl.loader = loader;
            $ctrl.passwordChangeData = {};

            $ctrl.submit = function () {
                $ctrl.errors = null;
                $ctrl.error = {};
                var hasError = false;
                var errorMsg;

                errorMsg = $ctrl.passwordChangeData.oldPassword === $ctrl.passwordChangeData.newPassword;
                $ctrl.error.newPassword = errorMsg
                hasError = hasError || errorMsg;

                if (!hasError) {
                    errorMsg = $ctrl.passwordChangeData.newPassword !== $ctrl.passwordChangeData.newPassword2;
                    $ctrl.error.newPassword2 = errorMsg;
                    hasError = hasError || errorMsg;
                }

                if (!hasError) {
                    return loader.wrapLoading(function() {
                        return accountApi.changeUserPassword($ctrl.passwordChangeData).then(function(response) {
                            if (!response.data.succeeded)
                                $ctrl.errors = response.data.errors;
                            return response;
                        }).then(function(result) {
                            angular.extend($ctrl, result);
                            $ctrl.passwordChangeData = {};
                            $ctrl.form.$setPristine();
                            return result;
                        });
                    });
                }
            };

            $ctrl.setForm = function (frm) { $ctrl.form = frm; };
        }]
    });
