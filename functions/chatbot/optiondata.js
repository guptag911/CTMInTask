const OptionSelecter = [
    {
        "buttons": [
            {
                "textButton": {
                    "text": "<font color=\"#716D51\">All Events</font>",
                    "onClick": {
                        "action": {
                            "actionMethodName": "allEvents",
                            // "parameters": [
                            //     {
                            //         "key": "time",
                            //         "value": "1 day"
                            //     },
                            //     {
                            //         "key": "id",
                            //         "value": "123456"
                            //     }
                            // ]
                        }
                    }
                }
            },
            {
                "textButton": {
                    "text": "<font color=\"#14A00B\">All Completed events</font>",
                    "onClick": {
                        "action": {
                            "actionMethodName": "completedEvents",
                        }
                    }
                }
            },
            {
                "textButton": {
                    "text": "<font color=\"#A00B3F\">All Upcoming events</font>",
                    "onClick": {
                        "action": {
                            "actionMethodName": "upcomingEvents",
                        }
                    }
                }
            }
        ]
    }
    ,
    {
        "buttons": [
            {
                "textButton": {
                    "text": "<font color=\"#716D51\">All docs tasks</font>",
                    "onClick": {
                        "action": {
                            "actionMethodName": "allDocsTasks",
                        }
                    }
                }
            },
            {
                "textButton": {
                    "text": "<font color=\"#14A00B\">Completed docs tasks</font>",
                    "onClick": {
                        "action": {
                            "actionMethodName": "completedDocsTasks",
                        }
                    }
                }
            },
            {
                "textButton": {
                    "text": "<font color=\"#A00B3F\">Pending docs tasks</font>",
                    "onClick": {
                        "action": {
                            "actionMethodName": "pendingDocsTasks",
                        }
                    }
                }
            }
        ]
    },

    {
        "buttons": [
            {
                "textButton": {
                    "text": "<font color=\"#716D51\">All sheets tasks</font>",
                    "onClick": {
                        "action": {
                            "actionMethodName": "allSheetsTasks",
                        }
                    }
                }
            },
            {
                "textButton": {
                    "text": "<font color=\"#14A00B\">Completed sheets tasks</font>",
                    "onClick": {
                        "action": {
                            "actionMethodName": "completedSheetsTasks",
                        }
                    }
                }
            },
            {
                "textButton": {
                    "text": "<font color=\"#A00B3F\">Pending sheets tasks</font>",
                    "onClick": {
                        "action": {
                            "actionMethodName": "pendingSheetsTasks",
                        }
                    }
                }
            }
        ]
    },
    {
        "buttons": [
            {
                "textButton": {
                    "text": "<font color=\"#716D51\">All slides tasks</font>",
                    "onClick": {
                        "action": {
                            "actionMethodName": "allSlidesTasks",
                        }
                    }
                }
            },
            {
                "textButton": {
                    "text": "<font color=\"#14A00B\">Completed slides tasks</font>",
                    "onClick": {
                        "action": {
                            "actionMethodName": "completedSlidesTasks",
                        }
                    }
                }
            },
            {
                "textButton": {
                    "text": "<font color=\"#A00B3F\">Pending slides tasks</font>",
                    "onClick": {
                        "action": {
                            "actionMethodName": "pendingSlidesTasks",
                        }
                    }
                }
            }
        ]
    },
    {
        "buttons": [
            {
                "textButton": {
                    "text": "<font color=\"#716D51\">All Hubspot tasks</font>",
                    "onClick": {
                        "action": {
                            "actionMethodName": "allHubspotTasks",
                        }
                    }
                }
            },
            {
                "textButton": {
                    "text": "<font color=\"#14A00B\">Completed Hubspot tasks</font>",
                    "onClick": {
                        "action": {
                            "actionMethodName": "completedHubspotTasks",
                        }
                    }
                }
            },
            {
                "textButton": {
                    "text": "<font color=\"#A00B3F\">Pending Hubspot tasks</font>",
                    "onClick": {
                        "action": {
                            "actionMethodName": "pendingHubspotTasks",
                        }
                    }
                }
            },
            {
                "textButton": {
                    "text": "<font color=\"#A00B3F\">Hubspot Notes</font>",
                    "onClick": {
                        "action": {
                            "actionMethodName": "HubspotNotes",
                        }
                    }
                }
            }
        ]
    },


    
    
    {
        "buttons": [
            {
                "textButton": {
                    "text": "<font color=\"#716D51\">All Jira tasks</font>",
                    "onClick": {
                        "action": {
                            "actionMethodName": "allJiraTasks",
                        }
                    }
                }
            },
            
            {
                "textButton": {
                    "text": "<font color=\"#14A00B\">Completed Jira tasks</font>",
                    "onClick": {
                        "action": {
                            "actionMethodName": "completedJiraTasks",
                        }
                    }
                }
            },
            {
                "textButton": {
                    "text": "<font color=\"#A00B3F\">Pending Jira tasks</font>",
                    "onClick": {
                        "action": {
                            "actionMethodName": "pendingJiraTasks",
                        }
                    }
                }
            }
        ]
    },
    {
        "buttons": [
            {
                "textButton": {
                    "text": "<font color=\"#716D51\">All Confluence tasks</font>",
                    "onClick": {
                        "action": {
                            "actionMethodName": "allConfluenceTasks",
                        }
                    }
                }
            },
            {
                "textButton": {
                    "text": "<font color=\"#14A00B\">Completed Confluence tasks</font>",
                    "onClick": {
                        "action": {
                            "actionMethodName": "completedConfluenceTasks",
                        }
                    }
                }
            },
            {
                "textButton": {
                    "text": "<font color=\"#A00B3F\">Pending Confluence tasks</font>",
                    "onClick": {
                        "action": {
                            "actionMethodName": "pendingConfluenceTasks",
                        }
                    }
                }
            }
        ]
    },
    {
        "buttons": [
            {
                "textButton": {
                    "text": "<font color=\"#716D51\">All Non-replied important mails</font>",
                    "onClick": {
                        "action": {
                            "actionMethodName": "allNonRepliedMails",
                        }
                    }
                }
            }
        ]
    }
]

module.exports = OptionSelecter;