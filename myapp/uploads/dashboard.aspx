<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" Inherits="dashboard" CodeBehind="dashboard.aspx.cs" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <div class="row">
        <div class="col-md-12 col-lg-12">
            <div class="chart-container divGuageContainer">
                <div class="row">
                    <div class="col-md-1 col-lg-1">
                    </div>
                    <div class="col-md-1 col-lg-1 col-sm-4 col-xs-4 alert-system">
                        <img src="img/12.png" class="imgNotification imgHover"><br />
                        <div id="divShipAlert" data-url="navigation.aspx" class="ship-alert">Navigation</div>
                    </div>
                    <div class="col-md-1 col-lg-1 col-sm-4 col-xs-4 alert-system">
                        <img src="img/12.png" class="imgNotification imgHover"><br />
                        <div id="divEngineAlert" data-url="main_engine.aspx" class="ship-alert">Engine</div>
                    </div>
                    <div class="col-md-1 col-lg-1 col-sm-4 col-xs-4 alert-system">
                        <img src="img/12.png" class="imgNotification imgHover"><br />
                        <div id="divTrimAlert" data-url="trim.aspx" class="ship-alert">Trim</div>
                    </div>
                    <div class="col-md-1 col-lg-1 col-sm-4 col-xs-4 alert-system">
                        <img src="img/12.png" class="imgNotification imgHover"><br />
                        <div id="divReportAlert" data-url="CreateNewReport.aspx" class="ship-alert">Reporting</div>
                    </div>
                    <div class="col-md-1 col-lg-1 col-sm-4 col-xs-4 alert-system">
                        <img src="img/12.png" class="imgNotification imgHover"><br />
                        <div id="divSensorAlert" data-url="navigation.aspx" class="ship-alert">Sensor Info</div>
                    </div>
                    <div class="col-md-1 col-lg-1 col-sm-4 col-xs-4 alert-system">
                        <img src="img/12.png" class="imgNotification imgHover"><br />
                        <div id="divMessageAlert" data-url="DisplayMessages.aspx" class="ship-alert">Messages</div>
                    </div>
                    <div class="col-md-1 col-lg-1 col-sm-4 col-xs-4 alert-system">
                        <img src="img/12.png" class="imgNotification imgHover"><br />
                        <div id="divFuelChangeAlert" data-url="AddFuelChangeData.aspx" class="ship-alert">Fuel Change</div>
                    </div>
                    <div class="col-md-1 col-lg-1 col-sm-4 col-xs-4 alert-system">
                        <img src="img/12.png" class="imgNotification imgHover"><br />
                        <div id="divVoyageAlert" data-url="Voyage.aspx" class="ship-alert">Voyage Status</div>
                    </div>
                    <div class="col-md-1 col-lg-1 col-sm-4 col-xs-4 alert-system">
                        <img src="img/12.png" class="imgNotification imgHover"><br />
                        <div id="divShipStateAlert" data-url="addShipStateData.aspx" class="ship-alert">Ship State</div>
                    </div>
                    <div class="col-md-1 col-lg-1 col-sm-4 col-xs-4 alert-system">
                        <img src="img/12.png" class="imgNotification imgHover"><br />
                        <div id="divCharterAlert" data-url="navigation.aspx" class="ship-alert">Charter</div>
                    </div>
                    <div class="col-md-1 col-lg-1">
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-3">
            <div class="row chart-block">
                <div class="chart-container fuel-data-container control-group">
                    <fieldset class="fsStyle">
                         <legend class="legendStyle">
                                <label>Current Voyage Data</label>
                          </legend>
                        <div class="row div-Nav-Data">
                            <label class="control-label">UTC Time</label>
                            <div class="float-right">
                                <span id="spnUtcTime" class="live-data">-</span>
                            </div>
                        </div>
                        <div class="row div-Nav-Data">
                            <label class="control-label">From</label>
                            <div class="float-right">
                                <span id="spnFrom" class="live-data">-</span>
                            </div>
                        </div>
                        <div class="row div-Nav-Data">
                            <label class="control-label">To</label>
                            <div class="float-right">
                                <span id="spnTo" class="live-data">-</span>
                            </div>
                        </div>
                        <div class="row div-Nav-Data">
                            <label class="control-label">Pilot Distance</label>
                            <div class="float-right">
                                <span id="spnPilotDist" class="live-data">-</span>
                            </div>
                        </div>
                        <div class="row div-Nav-Data">
                            <label class="control-label">Dist Travelled</label>
                            <div class="float-right">
                                <span id="spnDistTravelled" class="live-data">-</span>
                            </div>
                        </div>
                        <div class="row div-Nav-Data">
                            <label class="control-label">Dist To Go</label>
                            <div class="float-right">
                                <span id="spnDistToGo" class="live-data">-</span>
                            </div>
                        </div>
                        <div class="row div-Nav-Data">
                            <label class="control-label">ME Cons</label>
                            <div class="float-right">
                                <span id="spnFuelCons" class="live-data">-</span>
                            </div>
                        </div>
                    </fieldset>
                </div>
            </div>
            <div class="row chart-block">
                <div class="chart-container fuel-data-container control-group">
                    <fieldset class="fsStyle">
                        <legend class="legendStyle">
                            <label>ME Fuel in Use</label>
                            <i class="fa fa-bars menuBars" aria-hidden="true"></i>
                            <div class="contextMenu">
                                <ul class="dataList dataListStyle">
                                    <li class="listItems listItemsStyle">To update ME fuel data <a href="AddFuelChangeData.aspx">click here</a> </li>
                                    <li class="listItems listItemsStyle"><i class="fa fa-info-circle" name="ME_FUEL_USE_INFO" aria-hidden="true"></i></li>
                                </ul>
                            </div>
                        </legend>
                        <div class="row div-Nav-Data">
                            <label class="control-label">Fuel Id</label>
                            <div class="float-right">
                                <span id="spnFuelId" class="live-data"></span>
                            </div>
                        </div>
                        <div class="row div-Nav-Data">
                            <label class="control-label">Fuel C/O Time</label>
                            <div class="float-right">
                                <span id="spnFuelChange" class="live-data"></span>
                            </div>
                        </div>
                        <div class="row div-Nav-Data">
                            <label class="control-label">Latitude</label>
                            <div class="float-right">
                                <span id="spnLatitude" class="live-data"></span>
                            </div>
                        </div>
                        <div class="row div-Nav-Data">
                            <label class="control-label">Longtitude</label>
                            <div class="float-right">
                                <span id="spnLongtitude" class="live-data"></span>
                            </div>
                        </div>
                        <div class="row div-Nav-Data">
                            <label class="control-label">Sulfur content</label>
                            <div class="float-right">
                                <span id="spnSulfurContent" class="live-data"></span>
                                <span>%</span>
                            </div>
                        </div>
                    </fieldset>
                </div>
            </div>
            <div class="row chart-block">
                <div class="chart-container fuel-data-container control-group">
                    <fieldset class="fsStyle">
                        <legend class="legendStyle">
                            <label>Remaining Fuel On Board as on :</label>
                            <i class="fa fa-bars menuBars" aria-hidden="true"></i>
                            <div class="contextMenu">
                                <ul class="dataList dataListStyle">
                                    <li class="listItems listItemsStyle">To update remaining fuel on board data <a href="CreateNewReport.aspx">click here</a> </li>
                                    <li class="listItems listItemsStyle"><i class="fa fa-info-circle" name="REMAINING_FUEL_BOARD_INFO" aria-hidden="true"></i></li>
                                </ul>
                            </div>
                            <span id="spnFuelChangeOverUtcTime" class="live-data"></span>
                        </legend>
                        <div class="row div-Nav-Data">
                            <label class="control-label">HSFO</label>
                            <div class="float-right">
                                <span id="spnHSFO" class="live-data"></span>
                                <span>Mt</span>
                            </div>
                        </div>
                        <div class="row div-Nav-Data">
                            <label class="control-label">LSFO</label>
                            <div class="float-right">
                                <span id="spnLSFO" class="live-data"></span>
                                <span>Mt</span>
                            </div>
                        </div>
                        <div class="row div-Nav-Data">
                            <label class="control-label">HSDO</label>
                            <div class="float-right">
                                <span id="spnHSDO" class="live-data"></span>
                                <span>Mt</span>
                            </div>
                        </div>
                        <div class="row div-Nav-Data">
                            <label class="control-label">LSDO</label>
                            <div class="float-right">
                                <span id="spnLSDO" class="live-data"></span>
                                <span>Mt</span>
                            </div>
                        </div>
                    </fieldset>
                </div>
            </div>
        </div>
        <div class="col-md-6 col-lg-6">
            <div class="row">
                <div class="chart-container divGuageContainer">
                    <fieldset class="fsStyle">
                        <legend class="legendStyle">
                            <label>Efficiency Parameters</label>
                            <%--<i class="fa fa-bars menuBars" aria-hidden="true"></i>
                            <div class="contextMenu">
                                <ul class="dataList dataListStyle">
                                    <li class="listItems listItemsStyle"><i class="fa fa-info-circle" name="ME_DATA_INFO" aria-hidden="true"></i></li>
                                </ul>
                            </div>--%>
                        </legend>
                        <div class="row" style="height:250px">
                            <div class="col-md-3 col-lg-3 ">
                                <div id="twGuageContainer" class="row guageDashboardContainer"></div>
                                <div class="row div-Gauge-Data">
                                    <label class="control-label lblGauge">Act :</label>
                                    <div class="float-right">
                                        <span id="spnActTrim" class="valGauge"></span>
                                        <span class="font-size-8">m</span>
                                    </div>
                                </div>
                                <div class="row div-Gauge-Data">
                                    <label class="control-label lblGauge">Opt :</label>
                                    <div class="float-right">
                                        <span id="spnRefTrim" class="valGauge"></span>
                                        <span class="font-size-8">m</span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3 col-lg-3 ">
                                <div id="tdGuageContainer" class="row guageDashboardContainer"></div>
                                <div class="row div-Gauge-Data">
                                    <label class="control-label lblGauge">Act :</label>
                                    <div class="float-right">
                                        <span id="spnActSFOC" class="valGauge"></span>
                                        <span class="font-size-8">g/KWh</span>
                                    </div>
                                </div>
                                <div class="row div-Gauge-Data">
                                    <label class="control-label lblGauge">Ref :</label>
                                    <div class="float-right">
                                        <span id="spnRefSFOC" class="valGauge"></span>
                                        <span class="font-size-8">g/KWh</span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3 col-lg-3">
                                <div id="rwGuageContainer" class="row guageDashboardContainer"></div>
                                <div class="row div-Gauge-Data">
                                    <label class="control-label lblGauge">Act :</label>
                                    <div class="float-right">
                                        <span id="spnKgnm" class="valGauge"></span>
                                        <span class="font-size-8">Kg/Nm</span>
                                    </div>
                                </div>
                                <div class="row div-Gauge-Data">
                                    <label class="control-label lblGauge">Ref :</label>
                                    <div class="float-right">
                                        <span id="spnRefkgnm" class="valGauge"></span>
                                        <span class="font-size-8">Kg/Nm</span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3 col-lg-3 ">
                               <div id="hwGuageContainer" class="row guageDashboardContainer"></div>
                                <div class="row div-Gauge-Data">
                                    <label class="control-label lblGauge">Act :</label>
                                    <div class="float-right">
                                        <span id="spnActKwhNm" class="valGauge"></span>
                                        <span class="font-size-8">Kwh/Nm</span>
                                    </div>
                                </div>
                                <div class="row div-Gauge-Data">
                                    <label class="control-label lblGauge">Ref :</label>
                                    <div class="float-right">
                                        <span id="spnRefKwhNm" class="valGauge"></span>
                                        <span class="font-size-8">Kwh/Nm</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </fieldset>
                </div>
            </div>
            <div class="row" style="height: 520px">
                <div class="chart-container fuel-data-container control-group">
                    <div id="dashboardHeatMapContainer"></div>
                    <div id="logSpeedContainer"  style="height: 150px"></div>
                </div>
            </div>

        </div>
        <div class="col-md-3">
            <div class="row chart-block">
                <div class="chart-container fuel-data-container control-group">
                    <fieldset class="fsStyle">
                        <legend class="legendStyle">
                            <label>Main Engine Data</label>
                            <i class="fa fa-bars menuBars" aria-hidden="true"></i>
                            <div class="contextMenu">
                                <ul class="dataList dataListStyle">
                                    <li class="listItems listItemsStyle">To update engine data <a href="main_engine.aspx">click here</a> </li>
                                    <li class="listItems listItemsStyle"><i class="fa fa-info-circle" name="ENGINE_DATA_INFO" aria-hidden="true"></i></li>
                                </ul>
                            </div>
                        </legend>
                        <div class="row div-Nav-Data">
                            <label class="control-label">Engine Power</label>
                            <div class="float-right">
                                <span id="spnEngineLoad" class="live-data"></span>
                                <span>%</span>
                            </div>
                        </div>
                        <div class="row div-Nav-Data">
                            <label class="control-label">ME RPM</label>
                            <div class="float-right">
                                <span id="spnMeRPM" class="live-data"></span>
                            </div>
                        </div>
                        <div class="row div-Nav-Data">
                            <label class="control-label">Propeller Slip</label>
                            <div class="float-right">
                                <span id="spnPropellerSlip" class="live-data"></span>
                                <span>%</span>
                            </div>
                        </div>
                        <div class="row div-Nav-Data">
                            <label class="control-label">MT/day</label>
                            <div class="float-right">
                                <span id="spnMtPerDay" class="live-data"></span>
                                <span>MT</span>
                            </div>
                        </div>
                        <div class="row div-Nav-Data">
                            <label class="control-label">SFOC</label>
                            <div class="float-right">
                                <span id="spnSFOC" class="live-data"></span>
                                <span>g/KWh</span>
                            </div>
                        </div>
                    </fieldset>
                </div>
            </div>
            <div class="row chart-block">
                <div class="chart-container fuel-data-container control-group">
                    <fieldset class="fsStyle">
                        <legend class="legendStyle">
                            <label>Navigation Data</label>
                            <i class="fa fa-bars menuBars" aria-hidden="true"></i>
                            <div class="contextMenu">
                                <ul class="dataList dataListStyle">
                                    <li class="listItems listItemsStyle">To update navigation data <a href="navigation.aspx">click here</a> </li>
                                    <li class="listItems listItemsStyle"><i class="fa fa-info-circle" name="NAVIGATION_DATA_INFO" aria-hidden="true"></i></li>
                                </ul>
                            </div>
                        </legend>
                        <div class="row div-Nav-Data">
                            <label class="control-label">GPS Speed</label>
                            <div class="float-right">
                                <span id="spnGPSSpeed" class="live-data"></span>
                                <span>Knot</span>
                            </div>
                        </div>
                        <div class="row div-Nav-Data">
                            <label class="control-label">Log Speed</label>
                            <div class="float-right">
                                <span id="spnLogSpeed" class="live-data"></span>
                                <span>Knot</span>
                            </div>
                        </div>
                        <div class="row div-Nav-Data">
                            <label class="control-label">Rudder Angle</label>
                            <div class="float-right">
                                <span id="spnRudderAngle" class="live-data"></span>
                                <span>deg</span>
                            </div>
                        </div>
                        <div class="row div-Nav-Data">
                            <label class="control-label">Head Wind</label>
                            <div class="float-right">
                                <span id="spnHeadWind" class="live-data"></span>
                                <span>m/s</span>
                            </div>
                        </div>
                        <div class="row div-Nav-Data">
                            <label class="control-label">Rate Of Turn</label>
                            <div class="float-right">
                                <span id="spnRateOfTurn" class="live-data"></span>
                                <span>Deg/min</span>
                            </div>
                        </div>
                    </fieldset>
                </div>
            </div>
            <div class="row chart-block">
                <div class="chart-container fuel-data-container control-group">
                    <fieldset class="fsStyle">
                        <legend class="legendStyle">
                            <label>AE Data</label>
                            <i class="fa fa-bars menuBars" aria-hidden="true"></i>
                            <div class="contextMenu">
                                <ul class="dataList dataListStyle">
                                    <li class="listItems listItemsStyle">To update AE Data <a href="auxillary_engine.aspx">click here</a> </li>
                                    <li class="listItems listItemsStyle"><i class="fa fa-info-circle" name="AUXILARY_DATA_INFO" aria-hidden="true"></i></li>
                                </ul>
                            </div>
                        </legend>
                        <div class="row div-Nav-Data">
                            <label class="control-label">AE fuel Cons</label>
                            <div class="float-right">
                                <span id="spnFuel" class="live-data"></span>
                                <span>Mt/day</span>
                            </div>
                        </div>
                        <div class="row div-Nav-Data">
                            <label class="control-label">Total Power</label>
                            <div class="float-right">
                                <span id="spnTotalPower" class="live-data"></span>
                                <span>kW</span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <div class="col-md-3 ae-status">
                                    <img src="./img/redLight.png" width="20" alt="Alternate Text" id="imageAE1" class="ae-img"/>
                                    <span style="font-size:12px">AE-1</span>
                                </div>
                                <div class="col-md-3 ae-status">
                                    <img src="./img/redLight.png" width="20" alt="Alternate Text" id="imageAE2" class="ae-img"/>
                                    <span style="font-size:12px">AE-2</span>
                                </div>
                                <div class="col-md-3 ae-status">
                                    <img src="./img/redLight.png" width="20" alt="Alternate Text" id="imageAE3" class="ae-img"/>
                                    <span style="font-size:12px">AE-3</span>
                                </div>
                                <div class="col-md-3 ae-status">
                                     <img src="./img/redLight.png" width="20" alt="Alternate Text" id="imageAE4" class="ae-img"/>
                                    <span style="font-size:12px">AE-4</span>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                </div>
            </div>

        </div>
    </div>


    <script src="./assets/js/dashboard.js"></script>
    <script src="./assets/js/common.js"></script>
    
</asp:Content>

