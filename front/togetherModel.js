const models = [
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64e831864b84b428b8d322d0",
		"name": "Austism/chronos-hermes-13b",
		"display_name": "Chronos Hermes (13B)",
		"display_type": "chat",
		"description": "This model is a 75/25 merge of Chronos (13B) and Nous Hermes (13B) models resulting in having a great ability to produce evocative storywriting and follow a narrative.",
		"license": "other",
		"creator_organization": "Austism",
		"hardware_label": "2x A100 80GB",
		"num_parameters": 13000000000,
		"show_in_playground": true,
		"isFeaturedModel": true,
		"context_length": 2048,
		"config": {
			"stop": [
				"</s>"
			],
			"prompt_format": "### Instruction:\n{prompt}\n### Response:\n",
			"chat_template": "{% for message in messages %}{% if message['role'] == 'user' %}{{ '### Instruction:\n' + message['content'] + '\n' }}{% else %}{{ '### Response:\n' + message['content'] + '\n' }}{% endif %}{% endfor %}{{ '### Response:\n' }}"
		},
		"pricing": {
			"input": 75,
			"output": 75,
			"hourly": 0
		},
		"created_at": "2023-08-24T17:08:25.379Z",
		"update_at": "2023-08-24T17:08:25.379Z",
		"instances": [
			{
				"avzone": "us-central-1a",
				"cluster": "sassyseal"
			}
		],
		"access": "",
		"link": "",
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x255Ed7Da3d6C6f750d405334Ba5c87c8e239Faf7": 1
			},
			"asks_updated": "2024-01-12T10:45:53.608710674Z",
			"gpus": {
				"": 0
			},
			"qps": 0.2,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 131.46666666666667,
			"throughput_out": 16.666666666666668,
			"stats": [
				{
					"avzone": "us-central-1a",
					"cluster": "sassyseal",
					"capacity": 0.0705128205128205,
					"qps": 0.2,
					"throughput_in": 131.46666666666667,
					"throughput_out": 16.666666666666668,
					"error_rate": 0,
					"retry_rate": 0
				}
			]
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "657632ed6923087ddd5a6609",
		"name": "DiscoResearch/DiscoLM-mixtral-8x7b-v2",
		"display_name": "DiscoLM Mixtral 8x7b",
		"display_type": "chat",
		"description": "DiscoLM Mixtral 8x7b alpha is an experimental 8x7b MoE model based on Mistral AI's Mixtral 8x7b. ",
		"license": "apache-2.0",
		"link": "https://huggingface.co/DiscoResearch/DiscoLM-mixtral-8x7b-v2",
		"creator_organization": "DiscoResearch",
		"pricing_tier": "Featured",
		"access": "open",
		"num_parameters": "56000000000",
		"show_in_playground": true,
		"isFeaturedModel": true,
		"context_length": 32768,
		"config": {
			"stop": [
				"<|im_end|>",
				"</s>",
				"<|im_start|>"
			],
			"prompt_format": "<|im_start|>user\n{prompt}<|im_end|>\n<|im_start|>assistant",
			"chat_template": "{% if not add_generation_prompt is defined %}{% set add_generation_prompt = false %}{% endif %}{% for message in messages %}{{'<|im_start|>' + message['role'] + '\n' + message['content'] + '<|im_end|>' + '\n'}}{% endfor %}{% if add_generation_prompt %}{{ '<|im_start|>assistant\n' }}{% endif %}",
			"add_generation_prompt": true
		},
		"pricing": {
			"input": 150,
			"output": 150,
			"hourly": 0
		},
		"created_at": "2023-12-10T21:51:41.865Z",
		"update_at": "2023-12-10T21:51:41.865Z",
		"instances": [
			{
				"avzone": "us-east-1a",
				"cluster": "happypiglet"
			}
		],
		"hardware_label": "",
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0xBA3E32aC933c2094559eB6861a2b1564E60196A2": 1
			},
			"asks_updated": "2024-01-12T10:45:50.90846722Z",
			"gpus": {
				"": 0
			},
			"qps": 0,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"stats": [
				{
					"avzone": "us-east-1a",
					"cluster": "happypiglet",
					"capacity": 0.03676470588235294,
					"qps": 0,
					"throughput_in": 0,
					"throughput_out": 0,
					"error_rate": 0,
					"retry_rate": 0
				}
			]
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "6532f0faf94bacfc629b4cf7",
		"name": "EleutherAI/llemma_7b",
		"display_name": "Llemma (7B)",
		"display_type": "language",
		"description": "Llemma 7B is a language model for mathematics. It was initialized with Code Llama 7B weights, and trained on the Proof-Pile-2 for 200B tokens.",
		"license": "LLaMA license Agreement (Meta)",
		"link": "https://huggingface.co/EleutherAI/llemma_7b",
		"creator_organization": "EleutherAI",
		"hardware_label": "A100 80GB",
		"pricing_tier": "Featured",
		"access": "open",
		"num_parameters": 6738546688,
		"show_in_playground": true,
		"isFeaturedModel": true,
		"context_length": 4096,
		"config": {
			"chat_template_name": "llama"
		},
		"pricing": {
			"input": 50,
			"output": 50,
			"hourly": 0
		},
		"created_at": "2023-10-20T21:28:26.403Z",
		"update_at": "2023-10-24T17:42:38.630Z",
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x1de9B2f4CFe3fc2905B5C38302E77dd823536c73": 1
			},
			"asks_updated": "2024-01-12T03:25:03.845566258Z",
			"gpus": {
				"": 0
			},
			"qps": 0.034068074,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 0.64739907,
			"throughput_out": 2.76121
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64f78861d683768020b9f005",
		"name": "Gryphe/MythoMax-L2-13b",
		"display_name": "MythoMax-L2 (13B)",
		"display_type": "chat",
		"description": "MythoLogic-L2 and Huginn merge using a highly experimental tensor type merge technique. The main difference with MythoMix is that I allowed more of Huginn to intermingle with the single tensors located at the front and end of a model",
		"license": "other",
		"creator_organization": "Gryphe",
		"hardware_label": "1x A40 48GB",
		"num_parameters": 13000000000,
		"release_date": "2023-08-01T00:00:00.000Z",
		"show_in_playground": true,
		"isFeaturedModel": true,
		"context_length": 4096,
		"config": {
			"stop": [
				"</s>"
			],
			"prompt_format": "### Instruction:\n{prompt}\n### Response:",
			"chat_template": "{% for message in messages %}{% if message['role'] == 'user' %}{{ '### Instruction:\n' + message['content'] + '\n' }}{% else %}{{ '### Response:\n' + message['content'] + '\n' }}{% endif %}{% endfor %}{{ '### Response:' }}"
		},
		"pricing": {
			"input": 75,
			"output": 75,
			"hourly": 0
		},
		"created_at": "2023-09-05T19:58:25.683Z",
		"update_at": "2023-09-05T19:58:25.683Z",
		"instances": [
			{
				"avzone": "us-east-1a",
				"cluster": "happypiglet"
			},
			{
				"avzone": "us-east-2a",
				"cluster": "jumpyjackal"
			},
			{
				"avzone": "us-central-1a",
				"cluster": "sassyseal"
			}
		],
		"access": "",
		"link": "",
		"descriptionLink": "",
		"depth": {
			"num_asks": 22,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x0B1cD1bC822132837e07dC7Fde072d25ccc61f19": 1,
				"0x1E369D6B479606747b09DA25c1C2b7A7318c4ae5": 1,
				"0x1E91621e0d194497c5b8A8d89e0aAdaFbb6e487D": 1,
				"0x1b3D7472DCC94DbC10e6245454eeea539a765010": 1,
				"0x1cC18eE68FDCd943B8abD1C9E017A992CEfb7C20": 1,
				"0x206787C26aC596c0D59122961aBA185c80DD5a5c": 1,
				"0x208dfAC95159847A209534a91D5dA864EFCeC2b4": 1,
				"0x313387A438ED1f03a2d680bceD4Ae97F7E1d9724": 1,
				"0x37e91A3cc4321B72285311F4fF43F19a70031284": 1,
				"0x3850527E0e2d38493D8885164cbdA66A0E7E9EFf": 1,
				"0x3a455B8FED43041d744db8FfdB7e3Cd14c7987F2": 1,
				"0x4D18d19987c4E9520C5550DC556a3957dDF6C1aE": 1,
				"0x5D6Ec6C81678667b04246291872F14f19De81b01": 1,
				"0x74f191B3EbD079831523eD8949DDD5f983a4DAB3": 1,
				"0x8683a9501De813c6f9B41672Dd1b42a4498FCdCE": 1,
				"0x8F0Aa65B09FA8Ad2d88dE82105f81E85Cc341dD6": 1,
				"0x8f3ef7915Cf1A064d416805895B2A7085DB99Cf8": 1,
				"0x92D4a3573529bf0165e55E088fa79EedE7F59E22": 1,
				"0x98489b32756c5e519e0F19105DE8c7CEcdEB05b3": 1,
				"0xA2097568Fc4f4A175Fc8dF261AB7897E963DCE4F": 1,
				"0xAAc36075c74909Be69958c0e2e0A1Fdea4f4c687": 1,
				"0xB3168538E10D2ae9c5AE2692fF91b7a8aADfFA2A": 1,
				"0xB8f835E5d00712e72225f2DBc104E522379A7680": 1,
				"0xC416b98EA5a099B57e55bc4EeFef58002756ea13": 1
			},
			"asks_updated": "2024-01-12T10:56:24.555174903Z",
			"gpus": {
				"": 0
			},
			"qps": 28.200000000000003,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 25464,
			"throughput_out": 4101,
			"retry_rate": 0.06666666666666667,
			"stats": [
				{
					"avzone": "us-east-1a",
					"cluster": "happypiglet",
					"capacity": 0.10659452822224769,
					"qps": 9.333333333333334,
					"throughput_in": 8425.866666666667,
					"throughput_out": 1338.6,
					"error_rate": 0,
					"retry_rate": 0
				},
				{
					"avzone": "us-east-2a",
					"cluster": "jumpyjackal",
					"capacity": 0.546351084812624,
					"qps": 8.266666666666667,
					"throughput_in": 7537.666666666667,
					"throughput_out": 1148.8,
					"error_rate": 0,
					"retry_rate": 0.06666666666666667
				},
				{
					"avzone": "us-central-1a",
					"cluster": "sassyseal",
					"capacity": 0.5217583388557542,
					"qps": 10.6,
					"throughput_in": 9500.466666666667,
					"throughput_out": 1613.6,
					"error_rate": 0,
					"retry_rate": 0
				}
			]
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "6573540efe9a5c79871809ce",
		"name": "Meta-Llama/Llama-Guard-7b",
		"display_name": "Llama Guard (7B)",
		"description": "Llama Guard: LLM-based Input-Output Safeguard for Human-AI Conversations",
		"license": "LLaMA license Agreement (Meta)",
		"link": "https://huggingface.co/meta-llama/LlamaGuard-7b",
		"creator_organization": "Meta",
		"pricing_tier": "Featured",
		"access": "open",
		"show_in_playground": true,
		"isFeaturedModel": true,
		"config": {
			"chat_template": "{{ '[INST] Task: Check if there is unsafe content in \\'' }}{% if messages[messages.length-1]['role'] == 'user' %}{{ 'User' }}{% else %}{{ 'Agent' }}{% endif %}{{ '\\' messages in conversations according our safety policy with the below categories.\n\n<BEGIN UNSAFE CONTENT CATEGORIES>\nO1: Violence and Hate. \nShould not\n - Help people plan or engage in violence.\n - Encourage people to engage in violence.\n - Express hateful, derogatory, or demeaning sentiments against people based on sensitive personal characteristics like their race, color, religion, national origin, sexual orientation, gender, gender identity, or disability.\n - Encourage discrimination against people based on those characteristics and should not use slurs or create insults based on those characteristics.\nCan\n - Provide information on violence and discrimination.\n - Discuss the topics of hate and violence, and can discuss historical events involving violence.\nO2: Sexual Content. \nShould not\n - Engage in sexually explicit (i.e., erotic) conversations and should not encourage people to engage in sexual activities.\nCan\n - Discuss topics related to sexuality and sexual education.\n - Provide general information regarding sexual activities.\n - Provide guidance on topics related to sexual health.\nO3: Criminal Planning. \nShould not\n - Help people plan or engage in criminal activities like theft, kidnapping, or financial crimes, especially when the person indicates that they may act on the information provided to them.\n - Encourage people to engage in criminal activities or condone criminal behavior.\nCan\n - Help people understand how crimes are committed, provided that the response is not so detailed that it could be used to provide a roadmap for future crimes.\n - Help people understand how systems work that are used to prevent crimes, provided those descriptions do not provide detailed information on how to defeat those systems.\nO4: Guns and Illegal Weapons. \nShould not\n - Assist in the planning or execution of firearm or illegal weapons crimes, especially when the person indicates that they may act on the information provided to them.\n - Encourage people to engage in firearm or illegal weapons crimes or condone such behavior.\nCan\n - Discuss firearms and the arguments for and against firearm ownership.\nO5: Regulated or Controlled Substances. \nShould not\n - Encourage or assist people in the trafficking, consumption, or use of regulated or controlled substances, including but not limited to illegal drugs, tobacco, alcohol, and cannabis.\n - Assist or encourage people to create such substances when it is illegal to do so.\nCan\n - Discuss the use of regulated or controlled substances, and can provide general information on those substances (ex: what their chemical composition is and what their effects are).\n - Provide information on how those substances are manufactured, provided that the information is not so detailed as to provide step-by-step instructions for their creation.\nO6: Self-Harm. \nShould not\n - Encourage people to harm themselves.\n - Romanticize or condone self-harm or suicide.\n - Provide information regarding the methods of suicide or self-harm.\n - Provide any information or advice, other than information regarding appropriate health resources, to people who express or imply that they wish to harm themselves.\nCan\n - Provide general information regarding self-harm and suicide (ex: statistics, the mental health challenges faced by those who take these actions).\nShould\n - Provide information regarding appropriate health resources to people who imply or express the desire to harm themselves.\n<END UNSAFE CONTENT CATEGORIES>\n\n<BEGIN CONVERSATION>\n\n' }}{% for message in messages %}{% if message['role'] == 'user' %}{{ 'User: ' + message['content'] + '\n\n' }}{% else %}{{ 'Agent: ' + message['content'] + '\n\n' }}{% endif %}{% endfor %}{{ '<END CONVERSATION>\n\nProvide your safety assessment for '}}{% if messages[messages.length-1]['role'] == 'user' %}{{ 'User' }}{% else %}{{ 'Agent' }}{% endif %}{{' in the above conversation:\n - First line must read \\'safe\\' or \\'unsafe\\'.\n - If unsafe, a second line must include a comma-separated list of violated categories. [/INST]' }}",
			"safety_label": "safe",
			"safe_response": true,
			"safety_config": {
				"max_tokens": 64
			},
			"safety_categories": {
				"O1": "Violence and Hate",
				"O2": "Sexual Content",
				"O3": "Criminal Planning",
				"O4": "Guns and Illegal Weapons",
				"O5": "Regulated or Controlled Substances",
				"O6": "Self-Harm"
			}
		},
		"pricing": {
			"input": 50,
			"output": 50,
			"hourly": 0
		},
		"instances": [
			{
				"avzone": "us-central-5a",
				"cluster": "wrigleycub"
			}
		],
		"hardware_label": "",
		"descriptionLink": "",
		"depth": {
			"num_asks": 2,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x1bE91dbACe4c9fEeae5f5888ed0fAa6c5748e389": 1,
				"0x3964E9d3158Ae5096Cc87Ab4f5185B4Abe4cB11e": 1
			},
			"asks_updated": "2024-01-12T08:05:27.272289037Z",
			"gpus": {
				"": 0
			},
			"qps": 0.06666666666666667,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 71.53333333333333,
			"throughput_out": 0.06666666666666667,
			"stats": [
				{
					"avzone": "us-central-5a",
					"cluster": "wrigleycub",
					"capacity": 0.1074074074074074,
					"qps": 0.06666666666666667,
					"throughput_in": 71.53333333333333,
					"throughput_out": 0.06666666666666667,
					"error_rate": 0,
					"retry_rate": 0
				}
			]
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "656f5aac044c74c554a30c4f",
		"name": "Nexusflow/NexusRaven-V2-13B",
		"display_name": "NexusRaven (13B)",
		"display_type": "language",
		"description": "NexusRaven is an open-source and commercially viable function calling LLM that surpasses the state-of-the-art in function calling capabilities.",
		"license": "LLaMA license Agreement (Meta)",
		"link": "https://huggingface.co/Nexusflow/NexusRaven-V2-13B",
		"creator_organization": "Nexusflow",
		"hardware_label": "A100 80GB",
		"pricing_tier": "Featured",
		"access": "open",
		"num_parameters": "13000000000",
		"show_in_playground": true,
		"isFeaturedModel": true,
		"context_length": 16384,
		"pricing": {
			"input": 75,
			"output": 75,
			"hourly": 0
		},
		"created_at": "2023-12-05T17:15:24.561Z",
		"update_at": "2023-12-05T17:15:24.561Z",
		"instances": [
			{
				"avzone": "us-east-1a",
				"cluster": "happypiglet"
			}
		],
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x075F5e378Da00535E8BbB864f5587CC40f881b00": 1
			},
			"asks_updated": "2024-01-12T01:02:16.676771404Z",
			"gpus": {
				"": 0
			},
			"qps": 0,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"stats": [
				{
					"avzone": "us-east-1a",
					"cluster": "happypiglet",
					"capacity": 0,
					"qps": 0,
					"throughput_in": 0,
					"throughput_out": 0,
					"error_rate": 0,
					"retry_rate": 0
				}
			]
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "65664e4d79fe5514beebd5d3",
		"name": "NousResearch/Nous-Capybara-7B-V1p9",
		"display_name": "Nous Capybara v1.9 (7B)",
		"display_type": "chat",
		"description": "first Nous collection of dataset and models made by fine-tuning mostly on data created by Nous in-house",
		"license": "MIT",
		"creator_organization": "NousResearch",
		"hardware_label": "A100",
		"pricing_tier": "Featured",
		"num_parameters": 7241732096,
		"release_date": "2023-11-15T00:00:00.000Z",
		"show_in_playground": true,
		"isFeaturedModel": true,
		"config": {
			"stop": [
				"USER:",
				"ASSISTANT:"
			],
			"prompt_format": "USER:\n{prompt}\nASSISTANT:",
			"pre_prompt": ""
		},
		"pricing": {
			"input": 50,
			"output": 50
		},
		"created_at": "2023-11-28T20:32:13.026Z",
		"update_at": "2023-11-28T20:33:03.163Z",
		"access": "",
		"link": "",
		"descriptionLink": "",
		"depth": {
			"num_asks": 15,
			"num_bids": 11,
			"num_running": 11,
			"asks": {
				"0x15ad12e7f0c692e1C051d7c32C87Db8997239719": 1,
				"0x3812808EF729628F2A066D8d2096f47865a2F586": 2,
				"0xCd0A4b254331519B3912ee8c4543836e03AB003e": 2,
				"0xD7F589C032FE87f70a1c7efCBBAFf4D4bB8e33Be": 4,
				"0xb4C7952EB1A9B6cFB4822ab2F3434FA9669fAe33": 4,
				"0xeCecDe213d10a1Fbbe489DA4ba4Bd825C9dE70eD": 2
			},
			"asks_updated": "2024-01-12T04:32:31.111596964Z",
			"gpus": {
				"": 0
			},
			"qps": 0.5922982,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 5117.508,
			"throughput_out": 435.34113
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "658c8dad27fb98d2edc447ff",
		"name": "NousResearch/Nous-Hermes-2-Yi-34B",
		"display_name": "Nous Hermes-2 Yi (34B)",
		"display_type": "chat",
		"description": "Nous Hermes 2 - Yi-34B is a state of the art Yi Fine-tune",
		"license": "apache-2",
		"creator_organization": "NousResearch",
		"hardware_label": "A100",
		"pricing_tier": "Featured",
		"num_parameters": 34000000000,
		"release_date": "2023-12-27T20:48:45.586Z",
		"show_in_playground": true,
		"isFeaturedModel": true,
		"config": {
			"stop": [
				"<|im_start|>",
				"<|im_end|>"
			],
			"prompt_format": "<|im_start|>user\n{prompt}<|im_end|>\n<|im_start|>assistant\n",
			"chat_template_name": "default",
			"add_generation_prompt": true
		},
		"pricing": {
			"input": 200,
			"output": 200
		},
		"created_at": "2023-12-27T20:48:45.586Z",
		"update_at": "2023-12-27T20:50:38.632Z",
		"access": "",
		"link": "",
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x90462E9dF5B4D30aF311cF945680b9bF811b8D7f": 1
			},
			"asks_updated": "2024-01-12T04:23:51.930429846Z",
			"gpus": {
				"": 0
			},
			"qps": 0.023837503,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 31.584694,
			"throughput_out": 4.884221
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64cae18d3ede2fa7e2cbcc7d",
		"name": "NousResearch/Nous-Hermes-Llama2-13b",
		"display_name": "Nous Hermes Llama-2 (13B)",
		"display_type": "chat",
		"description": "Nous-Hermes-Llama2-13b is a state-of-the-art language model fine-tuned on over 300,000 instructions.",
		"license": "mit",
		"creator_organization": "NousResearch",
		"hardware_label": "2x A100 80GB",
		"pricing_tier": "featured",
		"access": "open",
		"num_parameters": 13000000000,
		"show_in_playground": true,
		"isFeaturedModel": true,
		"context_length": 4096,
		"config": {
			"prompt_format": "### Instruction:\n{prompt}\n### Response:\n",
			"stop": [
				"###",
				"</s>"
			],
			"chat_template_name": "llama",
			"chat_template": "{% for message in messages %}{% if message['role'] == 'user' %}{{ '### Instruction:\n' + message['content'] + '\n' }}{% else %}{{ '### Response:\n' + message['content'] + '\n' }}{% endif %}{% endfor %}{{ '### Response:\n' }}"
		},
		"pricing": {
			"input": 75,
			"output": 75,
			"hourly": 0
		},
		"created_at": "2023-08-02T23:06:53.926Z",
		"update_at": "2023-10-07T00:19:33.779Z",
		"instances": [
			{
				"avzone": "us-central-1a",
				"cluster": "sassyseal"
			},
			{
				"avzone": "us-east-1a",
				"cluster": "happypiglet"
			}
		],
		"link": "",
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0xb9F61c80edB496497C3Df67BD06499F16F123Eae": 1,
				"0xeAe825b6C2C451B647fd7e028aEb6BAB61422aaf": 1
			},
			"asks_updated": "2024-01-12T09:51:23.619461896Z",
			"gpus": {
				"": 0
			},
			"qps": 1.2,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 784.2,
			"throughput_out": 98.33333333333334,
			"stats": [
				{
					"avzone": "us-central-1a",
					"cluster": "sassyseal",
					"capacity": 0.3418803418803418,
					"qps": 0.6,
					"throughput_in": 340,
					"throughput_out": 83.46666666666667,
					"error_rate": 0,
					"retry_rate": 0
				},
				{
					"avzone": "us-east-1a",
					"cluster": "happypiglet",
					"capacity": 0.03333333333333335,
					"qps": 0.6,
					"throughput_in": 444.2,
					"throughput_out": 14.866666666666667,
					"error_rate": 0,
					"retry_rate": 0
				}
			]
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "6532f0faf94bacfc629b4cf8",
		"name": "NousResearch/Nous-Hermes-Llama2-70b",
		"display_name": "Nous Hermes LLaMA-2 (70B)",
		"display_type": "chat",
		"description": "Nous-Hermes-Llama2-70b is a state-of-the-art language model fine-tuned on over 300,000 instructions.",
		"license": "LLaMA license Agreement (Meta)",
		"link": "https://huggingface.co/NousResearch/Nous-Hermes-Llama2-70b",
		"creator_organization": "NousResearch",
		"hardware_label": "2X A100 80GB",
		"pricing_tier": "Featured",
		"access": "open",
		"num_parameters": 70000000000,
		"show_in_playground": true,
		"isFeaturedModel": false,
		"context_length": 4096,
		"config": {
			"stop": [
				"###",
				"</s>"
			],
			"prompt_format": "### Instruction:\n{prompt}\n\n### Response:\n",
			"chat_template_name": "llama",
			"chat_template": "{% for message in messages %}{% if message['role'] == 'user' %}{{ '### Instruction:\n' + message['content'] + '\n' }}{% else %}{{ '### Response:\n' + message['content'] + '\n' }}{% endif %}{% endfor %}{{ '### Response:\n' }}"
		},
		"pricing": {
			"input": 225,
			"output": 225,
			"hourly": 0
		},
		"created_at": "2023-10-20T21:28:26.404Z",
		"update_at": "2023-10-24T17:43:39.278Z",
		"instances": [
			{
				"avzone": "us-east-2a",
				"cluster": "jumpyjackal"
			}
		],
		"descriptionLink": "",
		"depth": {
			"num_asks": 2,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x897A39009678200dE6DA2B9aF46e902E4E206123": 1,
				"0xA8d55Bf4cc0947e687C58F5abB5e39598CBB3B39": 1
			},
			"asks_updated": "2024-01-12T05:50:56.063892565Z",
			"gpus": {
				"": 0
			},
			"qps": 0,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"stats": [
				{
					"avzone": "us-east-2a",
					"cluster": "jumpyjackal",
					"capacity": 0.07692307692307693,
					"qps": 0,
					"throughput_in": 0,
					"throughput_out": 0,
					"error_rate": 0,
					"retry_rate": 0
				}
			]
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "6532f0faf94bacfc629b4cf6",
		"name": "NousResearch/Nous-Hermes-llama-2-7b",
		"display_name": "Nous Hermes LLaMA-2 (7B)",
		"display_type": "chat",
		"description": "Nous-Hermes-Llama2-7b is a state-of-the-art language model fine-tuned on over 300,000 instructions.",
		"license": "LLaMA license Agreement (Meta)",
		"link": "https://huggingface.co/NousResearch/Nous-Hermes-llama-2-7b",
		"creator_organization": "NousResearch",
		"hardware_label": "A100 80GB",
		"pricing_tier": "Featured",
		"access": "open",
		"num_parameters": 6738415616,
		"show_in_playground": true,
		"isFeaturedModel": true,
		"context_length": 4096,
		"config": {
			"prompt_format": "### Instruction:\n{prompt}\n### Response:\n",
			"stop": [
				"###",
				"</s>"
			],
			"chat_template_name": "llama",
			"chat_template": "{% for message in messages %}{% if message['role'] == 'user' %}{{ '### Instruction:\n' + message['content'] + '\n' }}{% else %}{{ '### Response:\n' + message['content'] + '\n' }}{% endif %}{% endfor %}{{ '### Response:\n' }}"
		},
		"pricing": {
			"input": 50,
			"output": 50,
			"hourly": 0
		},
		"created_at": "2023-10-20T21:28:26.403Z",
		"update_at": "2023-10-24T17:41:52.365Z",
		"instances": [
			{
				"avzone": "us-east-2a",
				"cluster": "jumpyjackal"
			}
		],
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x3A0fc817f649b611714a1EbF02fBA1286D603D96": 1
			},
			"asks_updated": "2024-01-12T08:37:04.571876779Z",
			"gpus": {
				"": 0
			},
			"qps": 0,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"stats": [
				{
					"avzone": "us-east-2a",
					"cluster": "jumpyjackal",
					"capacity": 0.0078125,
					"qps": 0,
					"throughput_in": 0,
					"throughput_out": 0,
					"error_rate": 0,
					"retry_rate": 0
				}
			]
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64f677bdbc372ce719b97f05",
		"name": "NumbersStation/nsql-llama-2-7B",
		"display_name": "NSQL LLaMA-2 (7B)",
		"display_type": "code",
		"description": "NSQL is a family of autoregressive open-source large foundation models (FMs) designed specifically for SQL generation tasks.",
		"license": "llama2",
		"creator_organization": "Numbers Station",
		"hardware_label": "A40 48GB",
		"pricing_tier": "supported",
		"num_parameters": 7000000000,
		"show_in_playground": true,
		"isFeaturedModel": true,
		"context_length": 4096,
		"config": {
			"chat_template_name": "llama"
		},
		"pricing": {
			"input": 50,
			"output": 50,
			"hourly": 0
		},
		"created_at": "2023-09-05T00:35:09.649Z",
		"update_at": "2023-09-05T00:35:09.649Z",
		"access": "",
		"link": "",
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0xBb702A9526c057836fe845DF91dEAa3B5a48cc84": 1
			},
			"asks_updated": "2024-01-12T03:22:36.106249774Z",
			"gpus": {
				"": 0
			},
			"qps": 0.032455042,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 0.617054,
			"throughput_out": 0.6597889
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "6532f0faf94bacfc629b4cf5",
		"name": "Open-Orca/Mistral-7B-OpenOrca",
		"display_name": "OpenOrca Mistral (7B) 8K",
		"display_type": "chat",
		"description": "An OpenOrca dataset fine-tune on top of Mistral 7B by the OpenOrca team.",
		"license": "apache-2.0",
		"link": "https://huggingface.co/Open-Orca/Mistral-7B-OpenOrca",
		"creator_organization": "OpenOrca",
		"hardware_label": "A100 80GB",
		"pricing_tier": "Featured",
		"access": "open",
		"num_parameters": 7241748480,
		"show_in_playground": true,
		"isFeaturedModel": true,
		"context_length": 8192,
		"config": {
			"stop": [
				"<|im_end|>"
			],
			"prompt_format": "<|im_start|>user\n{prompt}<|im_end|>\n<|im_start|>assistant\n",
			"add_generation_prompt": true,
			"chat_template_name": "default"
		},
		"pricing": {
			"input": 50,
			"output": 50,
			"hourly": 0
		},
		"created_at": "2023-10-20T21:28:26.403Z",
		"update_at": "2023-10-24T00:01:52.541Z",
		"instances": [
			{
				"avzone": "us-east-2a",
				"cluster": "jumpyjackal"
			},
			{
				"avzone": "us-central-1a",
				"cluster": "sassyseal"
			}
		],
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x3bE0411E8B0D17e833aA6A3e4B68eD177A74B799": 1,
				"0x993a8ADcf3aA16e4786Cd7098EF99Cc53969B160": 1
			},
			"asks_updated": "2024-01-12T07:45:02.018556434Z",
			"gpus": {
				"": 0
			},
			"qps": 0.06666666666666667,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 0.4666666666666667,
			"throughput_out": 0.6666666666666666,
			"stats": [
				{
					"avzone": "us-east-2a",
					"cluster": "jumpyjackal",
					"capacity": 0.1,
					"qps": 0.06666666666666667,
					"throughput_in": 0.4666666666666667,
					"throughput_out": 0.6666666666666666,
					"error_rate": 0,
					"retry_rate": 0
				},
				{
					"avzone": "us-central-1a",
					"cluster": "sassyseal",
					"capacity": 0.1,
					"qps": 0,
					"throughput_in": 0,
					"throughput_out": 0,
					"error_rate": 0,
					"retry_rate": 0
				}
			]
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64fbbc5adfdb1e4b06b5d5cc",
		"name": "Phind/Phind-CodeLlama-34B-Python-v1",
		"display_name": "Phind Code LLaMA Python v1 (34B)",
		"display_type": "code",
		"description": "This model is fine-tuned from CodeLlama-34B-Python and achieves 69.5% pass@1 on HumanEval.",
		"license": "llama2",
		"creator_organization": "Phind",
		"hardware_label": "A100 80GB",
		"pricing_tier": "supported",
		"access": "open",
		"num_parameters": 33743970304,
		"show_in_playground": true,
		"isFeaturedModel": true,
		"context_length": 16384,
		"config": {
			"prompt_format": "### Instruction:\n{prompt}\n### Response:\n",
			"stop": [
				"</s>",
				"###"
			],
			"chat_template": "{% for message in messages %}{% if message['role'] == 'user' %}{{ '### Instruction:\n' + message['content'] + '\n' }}{% else %}{{ '### Response:\n' + message['content'] + '\n' }}{% endif %}{% endfor %}{{ '### Response:\n' }}"
		},
		"pricing": {
			"input": 200,
			"output": 200,
			"hourly": 0
		},
		"created_at": "2023-09-09T00:29:14.496Z",
		"update_at": "2023-09-09T00:29:14.496Z",
		"instances": [
			{
				"avzone": "us-east-2a",
				"cluster": "jumpyjackal"
			}
		],
		"link": "",
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0xaf74dDfFd9DC6F3ec0279355B0E2159a11ca690e": 1
			},
			"asks_updated": "2024-01-12T03:38:21.486529569Z",
			"gpus": {
				"": 0
			},
			"qps": 0,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"stats": [
				{
					"avzone": "us-east-2a",
					"cluster": "jumpyjackal",
					"capacity": 0.05,
					"qps": 0,
					"throughput_in": 0,
					"throughput_out": 0,
					"error_rate": 0,
					"retry_rate": 0
				}
			]
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64fbbc5adfdb1e4b06b5d5cb",
		"name": "Phind/Phind-CodeLlama-34B-v2",
		"display_name": "Phind Code LLaMA v2 (34B)",
		"display_type": "code",
		"description": "Phind-CodeLlama-34B-v1 trained on additional 1.5B tokens high-quality programming-related data proficient in Python, C/C++, TypeScript, Java, and more.",
		"license": "llama2",
		"creator_organization": "Phind",
		"hardware_label": "A100 80GB",
		"pricing_tier": "supported",
		"access": "open",
		"num_parameters": 33743970304,
		"show_in_playground": true,
		"isFeaturedModel": true,
		"context_length": 16384,
		"config": {
			"prompt_format": "### System Prompt\nYou are an intelligent programming assistant.\n\n### User Message\n{prompt}n\n### Assistant\n",
			"stop": [
				"</s>"
			],
			"chat_template": "{{ '### System Prompt\nYou are an intelligent programming assistant.\n\n' }}{% for message in messages %}{% if message['role'] == 'user' %}{{ '### User Message\n' + message['content'] + '\n' }}{% else %}{{ '### Assistant\n' + message['content'] + '\n' }}{% endif %}{% endfor %}{{ '### Assistant\n' }}"
		},
		"pricing": {
			"input": 200,
			"output": 200,
			"hourly": 0
		},
		"created_at": "2023-09-09T00:29:14.496Z",
		"update_at": "2023-09-09T00:29:14.496Z",
		"instances": [
			{
				"avzone": "us-east-2a",
				"cluster": "jumpyjackal"
			}
		],
		"link": "",
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x589b32956e88E449a9C37657f7D81C4cf3668dC0": 1
			},
			"asks_updated": "2024-01-12T10:08:29.22968739Z",
			"gpus": {
				"": 0
			},
			"qps": 0,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"stats": [
				{
					"avzone": "us-east-2a",
					"cluster": "jumpyjackal",
					"capacity": 0.05,
					"qps": 0,
					"throughput_in": 0,
					"throughput_out": 0,
					"error_rate": 0,
					"retry_rate": 0
				}
			]
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64acee11227f790586239d36",
		"name": "SG161222/Realistic_Vision_V3.0_VAE",
		"display_name": "Realistic Vision 3.0",
		"display_type": "image",
		"description": "Fine-tune version of Stable Diffusion focused on photorealism.",
		"license": "creativeml-openrail-m",
		"link": "https://huggingface.co/SG161222/Realistic_Vision_V1.4",
		"creator_organization": "SG161222",
		"hardware_label": "A40 48GB",
		"pricing_tier": "supported",
		"access": "open",
		"show_in_playground": true,
		"isFeaturedModel": true,
		"external_pricing_url": "https://www.together.xyz/apis#pricing",
		"config": {
			"height": 1024,
			"width": 1024,
			"steps": 20,
			"number_of_images": 2,
			"seed": 42
		},
		"created_at": "2023-07-11T05:52:17.219Z",
		"update_at": "2023-07-11T05:52:17.219Z",
		"descriptionLink": "",
		"pricing": {
			"hourly": 0,
			"input": 0,
			"output": 0,
			"base": 0,
			"finetune": 0
		},
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x1E128f472069E38aEF6B8f25147B42EF81f0F3C0": 1
			},
			"asks_updated": "2024-01-12T03:25:35.494017559Z",
			"gpus": {
				"NVIDIA A40": 1
			},
			"options": {
				"input=text,image": 1
			},
			"qps": 0.014990248,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 0.27945724
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "655d15e7b56cf1e0970c9b17",
		"name": "Undi95/ReMM-SLERP-L2-13B",
		"display_name": "ReMM SLERP L2 (13B)",
		"display_type": "chat",
		"description": "Re:MythoMax (ReMM) is a recreation trial of the original MythoMax-L2-B13 with updated models. This merge use SLERP [TESTING] to merge ReML and Huginn v1.2.",
		"license": "LLaMA license Agreement (Meta)",
		"link": "https://huggingface.co/Undi95/ReMM-SLERP-L2-13B",
		"creator_organization": "Undi95",
		"hardware_label": "A100 80GB",
		"pricing_tier": "Featured",
		"access": "open",
		"num_parameters": 13000000000,
		"show_in_playground": true,
		"isFeaturedModel": false,
		"context_length": 4096,
		"config": {
			"stop": [
				"###"
			],
			"prompt_format": "### Instruction:\n{prompt}\n\n### Response:",
			"chat_template": "{% for message in messages %}{% if message['role'] == 'user' %}{{ '### Instruction:\n' + message['content'] + '\n\n' }}{% else %}{{ '### Response:\n' + message['content'] + '\n\n' }}{% endif %}{% endfor %}{{ '### Response:' }}"
		},
		"pricing": {
			"input": 75,
			"output": 75,
			"hourly": 0
		},
		"created_at": "2023-11-21T20:41:11.759Z",
		"update_at": "2023-11-21T20:41:11.759Z",
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x38b90e0ae1a5fC42C364d1AfCA07184f153E5160": 1
			},
			"asks_updated": "2024-01-12T06:50:52.569437475Z",
			"gpus": {
				"": 0
			},
			"qps": 0.1974534,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 596.18536,
			"throughput_out": 83.202965
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "655d0fecb56cf1e0970c9b16",
		"name": "Undi95/Toppy-M-7B",
		"display_name": "Toppy M (7B)",
		"display_type": "chat",
		"description": "A merge of models built by Undi95 with the new task_arithmetic merge method from mergekit.",
		"license": "LLaMA license Agreement (Meta)",
		"link": "https://huggingface.co/Undi95/Toppy-M-7B",
		"creator_organization": "Undi95",
		"hardware_label": "A100 80GB",
		"pricing_tier": "Featured",
		"access": "open",
		"num_parameters": 7241748480,
		"show_in_playground": true,
		"isFeaturedModel": false,
		"context_length": 4096,
		"config": {
			"stop": [
				"###"
			],
			"prompt_format": "### Instruction:\n{prompt}\n\n### Response:",
			"chat_template": "{% for message in messages %}{% if message['role'] == 'user' %}{{ '### Instruction:\n' + message['content'] + '\n\n' }}{% else %}{{ '### Response:\n' + message['content'] + '\n\n' }}{% endif %}{% endfor %}{{ '### Response:' }}"
		},
		"pricing": {
			"input": 50,
			"output": 50,
			"hourly": 0
		},
		"created_at": "2023-11-21T20:15:40.468Z",
		"update_at": "2023-11-21T20:15:40.468Z",
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 1,
			"num_running": 1,
			"asks": {
				"0x2e58c20b3e8090632DdE22091EC734E2F15207AA": 1
			},
			"asks_updated": "2024-01-12T09:32:14.917419712Z",
			"gpus": {
				"": 0
			},
			"qps": 0.02683271,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 65.7249,
			"throughput_out": 4.1923313
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64fbbc5adfdb1e4b06b5d5cd",
		"name": "WizardLM/WizardCoder-15B-V1.0",
		"display_name": "WizardCoder v1.0 (15B)",
		"display_type": "code",
		"description": "This model empowers Code LLMs with complex instruction fine-tuning, by adapting the Evol-Instruct method to the domain of code.",
		"license": "llama2",
		"creator_organization": "WizardLM",
		"hardware_label": "A100 80GB",
		"pricing_tier": "supported",
		"access": "open",
		"num_parameters": 15517462528,
		"show_in_playground": true,
		"context_length": 8192,
		"config": {
			"prompt_format": "### Instruction:\n{prompt}\n\n### Response:\n",
			"stop": [
				"###",
				"<|endoftext|>"
			],
			"chat_template": "{% for message in messages %}{% if message['role'] == 'user' %}{{ '### Instruction:\n' + message['content'] + '\n\n' }}{% else %}{{ '### Response:\n' + message['content'] + '\n\n' }}{% endif %}{% endfor %}{{ '### Response:\n' }}"
		},
		"pricing": {
			"input": 75,
			"output": 75,
			"hourly": 0
		},
		"created_at": "2023-09-09T00:29:14.496Z",
		"update_at": "2023-09-09T00:29:14.496Z",
		"instances": [
			{
				"avzone": "us-east-2a",
				"cluster": "jumpyjackal"
			}
		],
		"link": "",
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x52485C1e2C2f4Db6a091c799eB882DaC0B7eFA2e": 1
			},
			"asks_updated": "2024-01-12T01:18:50.563663517Z",
			"gpus": {
				"": 0
			},
			"qps": 0,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"stats": [
				{
					"avzone": "us-east-2a",
					"cluster": "jumpyjackal",
					"capacity": 0.0078125,
					"qps": 0,
					"throughput_in": 0,
					"throughput_out": 0,
					"error_rate": 0,
					"retry_rate": 0
				}
			]
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64f672e8bc372ce719b97f02",
		"name": "WizardLM/WizardCoder-Python-34B-V1.0",
		"display_name": "WizardCoder Python v1.0 (34B)",
		"display_type": "code",
		"description": "This model empowers Code LLMs with complex instruction fine-tuning, by adapting the Evol-Instruct method to the domain of code.",
		"license": "llama2",
		"creator_organization": "WizardLM",
		"hardware_label": "2x A100 80GB",
		"pricing_tier": "supported",
		"num_parameters": 34000000000,
		"show_in_playground": true,
		"isFeaturedModel": true,
		"context_length": 8192,
		"config": {
			"stop": [
				"</s>",
				"###"
			],
			"prompt_format": "### Instruction:\n{prompt}\n### Response:\n"
		},
		"pricing": {
			"input": 200,
			"output": 200,
			"hourly": 0
		},
		"created_at": "2023-09-05T00:14:32.365Z",
		"update_at": "2023-09-05T00:14:32.365Z",
		"instances": [
			{
				"avzone": "us-east-2a",
				"cluster": "jumpyjackal"
			}
		],
		"access": "",
		"link": "",
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0xa3067d4A48E9075b24B1a02eD3090b325202301b": 1
			},
			"asks_updated": "2024-01-12T10:46:23.807898245Z",
			"gpus": {
				"": 0
			},
			"qps": 0,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"stats": [
				{
					"avzone": "us-east-2a",
					"cluster": "jumpyjackal",
					"capacity": 0.05,
					"qps": 0,
					"throughput_in": 0,
					"throughput_out": 0,
					"error_rate": 0,
					"retry_rate": 0
				}
			]
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "6567d4e5d1c5e59967640530",
		"name": "WizardLM/WizardLM-13B-V1.2",
		"display_name": "WizardLM v1.2 (13B)",
		"display_type": "chat",
		"description": "This model achieves a substantial and comprehensive improvement on coding, mathematical reasoning and open-domain conversation capacities",
		"license": "llama2",
		"creator_organization": "WizardLM",
		"hardware_label": "A100",
		"pricing_tier": "Featured",
		"num_parameters": 13000000000,
		"release_date": "2023-11-01T00:00:00.000Z",
		"show_in_playground": true,
		"isFeaturedModel": true,
		"config": {
			"stop": [
				"</s>",
				"USER:",
				"ASSISTANT:"
			],
			"prompt_format": "USER: {prompt} ASSISTANT:",
			"pre_prompt": "A chat between a curious user and an artificial intelligence assistant. The assistant gives helpful, detailed, and polite answers to the user's questions. "
		},
		"pricing": {
			"input": 50,
			"output": 50
		},
		"created_at": "2023-11-30T00:18:45.791Z",
		"update_at": "2023-11-30T01:20:01.779Z",
		"instances": [
			{
				"avzone": "us-east-2a",
				"cluster": "jumpyjackal"
			}
		],
		"access": "",
		"link": "",
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0xebdAc92FF164586c1c3B0bA29856A3006F2997B1": 1
			},
			"asks_updated": "2024-01-12T10:46:05.729432702Z",
			"gpus": {
				"": 0
			},
			"qps": 0,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"stats": [
				{
					"avzone": "us-east-2a",
					"cluster": "jumpyjackal",
					"capacity": 0.08333333333333333,
					"qps": 0,
					"throughput_in": 0,
					"throughput_out": 0,
					"error_rate": 0,
					"retry_rate": 0
				}
			]
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64f67555bc372ce719b97f03",
		"name": "WizardLM/WizardLM-70B-V1.0",
		"display_name": "WizardLM v1.0 (70B)",
		"display_type": "language",
		"description": "This model achieves a substantial and comprehensive improvement on coding, mathematical reasoning and open-domain conversation capacities.",
		"license": "llama2",
		"creator_organization": "WizardLM",
		"hardware_label": "2x A100 80GB",
		"pricing_tier": "supported",
		"num_parameters": 70000000000,
		"show_in_playground": true,
		"isFeaturedModel": true,
		"context_length": 4096,
		"config": {
			"stop": [
				"</s>"
			],
			"prompt_format": "USER: {prompt} ASSISTANT:",
			"chat_template": "{% for message in messages %}{% if message['role'] == 'user' %}{{ 'USER: ' + message['content'] + ' ' }}{% else %}{{ 'ASSISTANT:' + message['content'] + '\n' }}{% endif %}{% endfor %}{{ 'ASSISTANT:' }}"
		},
		"pricing": {
			"input": 225,
			"output": 225,
			"hourly": 0
		},
		"created_at": "2023-09-05T00:24:53.327Z",
		"update_at": "2023-09-05T00:24:53.327Z",
		"instances": [
			{
				"avzone": "us-east-2a",
				"cluster": "jumpyjackal"
			}
		],
		"access": "",
		"link": "",
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x7deea9c37D0514E60862b783fFdcC15Bd8C3Bb7b": 1
			},
			"asks_updated": "2024-01-12T07:50:48.413852369Z",
			"gpus": {
				"": 0
			},
			"qps": 0,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"stats": [
				{
					"avzone": "us-east-2a",
					"cluster": "jumpyjackal",
					"capacity": 0.10256410256410257,
					"qps": 0,
					"throughput_in": 0,
					"throughput_out": 0,
					"error_rate": 0,
					"retry_rate": 0
				}
			]
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64f676f7bc372ce719b97f04",
		"name": "garage-bAInd/Platypus2-70B-instruct",
		"display_name": "Platypus2 Instruct (70B)",
		"display_type": "chat",
		"description": "An instruction fine-tuned LLaMA-2 (70B) model by merging Platypus2 (70B) by garage-bAInd and LLaMA-2 Instruct v2 (70B) by upstage.",
		"license": "CC BY-NC-4.0",
		"creator_organization": "garage-bAInd",
		"hardware_label": "2x A100 80GB",
		"pricing_tier": "featured",
		"num_parameters": 70000000000,
		"show_in_playground": true,
		"isFeaturedModel": true,
		"context_length": 4096,
		"config": {
			"stop": [
				"</s>",
				"###"
			],
			"prompt_format": "### Instruction:\n{prompt}\n### Response:\n"
		},
		"pricing": {
			"input": 225,
			"output": 225,
			"hourly": 0
		},
		"created_at": "2023-09-05T00:31:51.264Z",
		"update_at": "2023-09-07T01:46:29.338Z",
		"access": "",
		"link": "",
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x763611653e222b6a0a8b7E060FB819A1FfcDF025": 1
			},
			"asks_updated": "2024-01-12T05:16:58.929614929Z",
			"gpus": {
				"": 0
			},
			"qps": 0.037114855,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 35.32119,
			"throughput_out": 4.5534315
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64acea57227f790586239d0d",
		"name": "huggyllama/llama-65b",
		"display_name": "LLaMA (65B)",
		"display_type": "language",
		"description": "An auto-regressive language model, based on the transformer architecture. The model comes in different sizes: 7B, 13B, 33B and 65B parameters.",
		"license": "LLaMA license Agreement (Meta)",
		"link": "https://huggingface.co/decapoda-research/llama-30b-hf-int4/commit/95d097b272bd0a84a164aa8116e8c09661487581#d2h-740129",
		"creator_organization": "Meta",
		"hardware_label": "2x A100 80GB",
		"pricing_tier": "supported",
		"access": "open",
		"num_parameters": 65000000000,
		"show_in_playground": true,
		"isFeaturedModel": true,
		"context_length": 2048,
		"config": {
			"chat_template_name": "llama"
		},
		"pricing": {
			"input": 225,
			"output": 225,
			"hourly": 0
		},
		"created_at": "2023-07-11T05:36:23.656Z",
		"update_at": "2023-07-11T05:36:23.656Z",
		"instances": [
			{
				"avzone": "us-east-2a",
				"cluster": "jumpyjackal"
			}
		],
		"descriptionLink": "",
		"depth": {
			"num_asks": 3,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x5Db772c45b58EefE138373DED59B8c648a4bA89a": 1,
				"0xAa53c46CBC899AB34292E4b8d51AbFd1Fa7288F4": 1,
				"0xf614e3DF144F9F859cDac30bAe98ea9BbA187D72": 1
			},
			"asks_updated": "2024-01-12T10:42:37.269190646Z",
			"gpus": {
				"": 0
			},
			"qps": 0,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"stats": [
				{
					"avzone": "us-east-2a",
					"cluster": "jumpyjackal",
					"capacity": 0.5,
					"qps": 0,
					"throughput_in": 0,
					"throughput_out": 0,
					"error_rate": 0,
					"retry_rate": 0
				}
			]
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64fbbc5adfdb1e4b06b5d5ce",
		"name": "lmsys/vicuna-13b-v1.5-16k",
		"display_name": "Vicuna v1.5 16K (13B)",
		"display_type": "chat",
		"description": "Vicuna is a chat assistant trained by fine-tuning Llama 2 on user-shared conversations collected from ShareGPT.",
		"license": "llama2",
		"creator_organization": "LM Sys",
		"hardware_label": "A100 80GB",
		"pricing_tier": "supported",
		"access": "open",
		"num_parameters": 13015864320,
		"show_in_playground": true,
		"isFeaturedModel": true,
		"context_length": 16384,
		"config": {
			"prompt_format": "USER: {prompt}\nASSISTANT:",
			"stop": [
				"</s>"
			],
			"chat_template": "{% for message in messages %}{{message['role'].toLocaleUpperCase() + ': ' + message['content'] + '\n'}}{% endfor %}{{ 'ASSISTANT:' }}"
		},
		"pricing": {
			"input": 75,
			"output": 75,
			"hourly": 0
		},
		"created_at": "2023-09-09T00:29:14.496Z",
		"update_at": "2023-09-09T00:29:14.496Z",
		"instances": [
			{
				"avzone": "us-central-1a",
				"cluster": "sassyseal"
			}
		],
		"link": "",
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x0c622aB2F8608DB41c071c0D36DB2D96413A640D": 1
			},
			"asks_updated": "2024-01-12T06:08:17.675037221Z",
			"gpus": {
				"": 0
			},
			"qps": 0,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"stats": [
				{
					"avzone": "us-central-1a",
					"cluster": "sassyseal",
					"capacity": 0.14285714285714285,
					"qps": 0,
					"throughput_in": 0,
					"throughput_out": 0,
					"error_rate": 0,
					"retry_rate": 0
				}
			]
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64f678e7bc372ce719b97f06",
		"name": "lmsys/vicuna-13b-v1.5",
		"display_name": "Vicuna v1.5 (13B)",
		"display_type": "chat",
		"description": "Vicuna is a chat assistant trained by fine-tuning Llama 2 on user-shared conversations collected from ShareGPT.",
		"license": "llama2",
		"creator_organization": "LM Sys",
		"hardware_label": "A40 48GB",
		"pricing_tier": "supported",
		"access": "open",
		"num_parameters": 13000000000,
		"show_in_playground": true,
		"isFeaturedModel": true,
		"context_length": 4096,
		"config": {
			"stop": [
				"</s>"
			],
			"prompt_format": "USER: {prompt}\nASSISTANT:",
			"chat_template": "{% for message in messages %}{{message['role'].toLocaleUpperCase() + ': ' + message['content'] + '\n'}}{% endfor %}{{ 'ASSISTANT:' }}"
		},
		"pricing": {
			"input": 75,
			"output": 75,
			"hourly": 0
		},
		"created_at": "2023-09-05T00:40:07.763Z",
		"update_at": "2023-09-05T00:40:07.763Z",
		"instances": [
			{
				"avzone": "us-central-1a",
				"cluster": "sassyseal"
			}
		],
		"link": "",
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x54445411C6D7A375D363ee3D097F020128b2c1Db": 1
			},
			"asks_updated": "2024-01-12T10:40:21.572811167Z",
			"gpus": {
				"": 0
			},
			"qps": 0,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"stats": [
				{
					"avzone": "us-central-1a",
					"cluster": "sassyseal",
					"capacity": 0.09523809523809523,
					"qps": 0,
					"throughput_in": 0,
					"throughput_out": 0,
					"error_rate": 0,
					"retry_rate": 0
				}
			]
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "652da26579174a6bc507647f",
		"name": "lmsys/vicuna-7b-v1.5",
		"display_name": "Vicuna v1.5 (7B)",
		"display_type": "chat",
		"description": "Vicuna is a chat assistant trained by fine-tuning Llama 2 on user-shared conversations collected from ShareGPT.",
		"license": "LLaMA license Agreement (Meta)",
		"link": "https://huggingface.co/lmsys/vicuna-7b-v1.5",
		"creator_organization": "LM Sys",
		"hardware_label": "A40 48GB",
		"pricing_tier": "Featured",
		"access": "open",
		"num_parameters": 6738415616,
		"show_in_playground": true,
		"isFeaturedModel": false,
		"context_length": 4096,
		"config": {
			"stop": [
				"</s>",
				"USER:"
			],
			"prompt_format": "USER: {prompt}\nASSISTANT: Hello!",
			"chat_template": "{% for message in messages %}{{message['role'].toLocaleUpperCase() + ': ' + message['content'] + '\n'}}{% endfor %}{{ 'ASSISTANT:' }}"
		},
		"pricing": {
			"input": 50,
			"output": 50,
			"hourly": 0
		},
		"created_at": "2023-10-16T20:51:49.194Z",
		"update_at": "2023-10-16T20:51:49.194Z",
		"instances": [
			{
				"avzone": "us-central-1a",
				"cluster": "sassyseal"
			}
		],
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0xD4B1C96188b54214B0e63fD8876bd881AF044bba": 1
			},
			"asks_updated": "2024-01-12T02:38:14.874894087Z",
			"gpus": {
				"": 0
			},
			"qps": 0.2,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 99.26666666666667,
			"throughput_out": 32.2,
			"stats": [
				{
					"avzone": "us-central-1a",
					"cluster": "sassyseal",
					"capacity": 0.04347826086956521,
					"qps": 0.2,
					"throughput_in": 99.26666666666667,
					"throughput_out": 32.2,
					"error_rate": 0,
					"retry_rate": 0
				}
			]
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "6514c873829715ded9cd17b1",
		"name": "mistralai/Mistral-7B-Instruct-v0.1",
		"display_name": "Mistral (7B) Instruct",
		"display_type": "chat",
		"description": "instruct fine-tuned version of Mistral-7B-v0.1",
		"license": "Apache-2",
		"creator_organization": "mistralai",
		"hardware_label": "2x A100 80GB",
		"num_parameters": 7241732096,
		"release_date": "2023-09-27T00:00:00.000Z",
		"show_in_playground": true,
		"finetuning_supported": true,
		"isFeaturedModel": true,
		"context_length": 4096,
		"config": {
			"stop": [
				"[/INST]",
				"</s>"
			],
			"prompt_format": "<s>[INST] {prompt} [/INST]",
			"chat_template_name": "llama",
			"tools_template": "{{ '<<SYS>>\nYou are a helpful assistant with access to the following functions. Use them if required -\n' + tools + '\n<</SYS>>\n\n' + message['content'] }}"
		},
		"pricing": {
			"input": 50,
			"output": 50,
			"hourly": 0
		},
		"created_at": "2023-09-28T00:27:31.815Z",
		"update_at": "2023-10-12T01:13:51.840Z",
		"instances": [
			{
				"avzone": "us-east-1a",
				"cluster": "happypiglet"
			}
		],
		"access": "",
		"link": "",
		"descriptionLink": "",
		"depth": {
			"num_asks": 2,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x15e9dF0F77024826Ce4A53907d810e5c87325346": 1,
				"0x439F7273C53604f668d9A73ABda3bBCF81C87d7e": 1
			},
			"asks_updated": "2024-01-12T03:56:19.017369995Z",
			"gpus": {
				"": 0
			},
			"qps": 1.8,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 724,
			"throughput_out": 318.73333333333335,
			"stats": [
				{
					"avzone": "us-east-1a",
					"cluster": "happypiglet",
					"capacity": 0.1668978270920017,
					"qps": 1.8,
					"throughput_in": 724,
					"throughput_out": 318.73333333333335,
					"error_rate": 0,
					"retry_rate": 0
				}
			]
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "65776c7d6923087ddd5a660a",
		"name": "mistralai/Mistral-7B-Instruct-v0.2",
		"display_name": "Mistral (7B) Instruct v0.2",
		"display_type": "chat",
		"description": "The Mistral-7B-Instruct-v0.2 Large Language Model (LLM) is an improved instruct fine-tuned version of Mistral-7B-Instruct-v0.1.",
		"license": "apache-2.0",
		"creator_organization": "mistralai",
		"pricing_tier": "Featured",
		"num_parameters": 7000000000,
		"release_date": "2023-11-01T00:00:00.000Z",
		"show_in_playground": true,
		"finetuning_supported": true,
		"isFeaturedModel": true,
		"context_length": 32768,
		"config": {
			"prompt_format": "[INST] {prompt} [/INST]",
			"stop": [
				"[/INST]",
				"</s>"
			],
			"chat_template_name": "llama",
			"tools_template": "{{ 'If you need to invoke any of the following functions:\n' + tools + '\nplease respond in the following JSON format:\n[\n\n  {\n    \"name\": \"the name of the function to be invoked\",\n    \"arguments\": {\"key1\": \"value1\", \"key2\": \"value2\", ...}\n  }\n]\nIf any required arguments are missing, please ask for them without JSON function calls.\nIf the instruction does not necessitate a function call, please provide your response in clear, concise natural language.\n\n' + message['content'] }}"
		},
		"pricing": {
			"input": 50,
			"output": 50,
			"hourly": 0
		},
		"created_at": "2023-12-11T20:09:33.627Z",
		"update_at": "2023-12-11T20:09:33.627Z",
		"instances": [
			{
				"avzone": "us-east-1a",
				"cluster": "happypiglet"
			},
			{
				"avzone": "us-central-1a",
				"cluster": "sassyseal"
			}
		],
		"access": "",
		"hardware_label": "",
		"link": "",
		"descriptionLink": "",
		"depth": {
			"num_asks": 2,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x93B19479E81af6622065d6Ce1cE8f55e0B7Fe5E1": 1,
				"0x93C318521A19683d65d066165C4BaDC3D7920aaA": 1,
				"0xe58D8966A1b792AB22E9015068792544f8230B11": 1
			},
			"asks_updated": "2024-01-12T10:47:14.012187436Z",
			"gpus": {
				"": 0
			},
			"qps": 1.5333333333333332,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 379.73333333333335,
			"throughput_out": 647.9333333333334,
			"stats": [
				{
					"avzone": "us-east-1a",
					"cluster": "happypiglet",
					"capacity": 0.2695560253699788,
					"qps": 0.6,
					"throughput_in": 145.4,
					"throughput_out": 302.8666666666667,
					"error_rate": 0,
					"retry_rate": 0
				},
				{
					"avzone": "us-central-1a",
					"cluster": "sassyseal",
					"capacity": 0.3425925925925927,
					"qps": 0.9333333333333333,
					"throughput_in": 234.33333333333334,
					"throughput_out": 345.06666666666666,
					"error_rate": 0,
					"retry_rate": 0
				}
			]
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "6514c6ee829715ded9cd17b0",
		"name": "mistralai/Mistral-7B-v0.1",
		"display_name": "Mistral (7B)",
		"display_type": "language",
		"description": "7.3B parameter model that outperforms Llama 2 13B on all benchmarks, approaches CodeLlama 7B performance on code, Uses Grouped-query attention (GQA) for faster inference and Sliding Window Attention (SWA) to handle longer sequences at smaller cost",
		"license": "Apache-2",
		"creator_organization": "mistralai",
		"hardware_label": "2x A100 80GB",
		"num_parameters": 7241732096,
		"release_date": "2023-09-27T00:00:00.000Z",
		"show_in_playground": true,
		"finetuning_supported": true,
		"isFeaturedModel": true,
		"context_length": 4096,
		"config": {
			"stop": [
				"</s>"
			],
			"prompt_format": "{prompt}",
			"chat_template_name": "llama"
		},
		"pricing": {
			"input": 50,
			"output": 50,
			"hourly": 0
		},
		"created_at": "2023-09-28T00:21:02.330Z",
		"update_at": "2023-09-28T00:21:02.330Z",
		"instances": [
			{
				"avzone": "us-east-1a",
				"cluster": "happypiglet"
			}
		],
		"access": "",
		"link": "",
		"descriptionLink": "",
		"depth": {
			"num_asks": 4,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x1E7Ef4AAE66AF617Dc063866d23B3Add1204d450": 1,
				"0x6313B61c1F6024cCf157162E822f7C9DB46F2584": 1,
				"0xACCa4a28B26B00ba8e56191E39423e6edd93130B": 1,
				"0xa72A4ed9531acbc8E91e367B6CA31e1Bb88C73D1": 1
			},
			"asks_updated": "2024-01-12T10:39:16.492810649Z",
			"gpus": {
				"": 0
			},
			"qps": 1.1333333333333333,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 276.8,
			"throughput_out": 122.6,
			"retry_rate": 0.06666666666666667,
			"stats": [
				{
					"avzone": "us-east-1a",
					"cluster": "happypiglet",
					"capacity": 0.05598669623059863,
					"qps": 1.1333333333333333,
					"throughput_in": 276.8,
					"throughput_out": 122.6,
					"error_rate": 0,
					"retry_rate": 0.06666666666666667
				}
			]
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "6577af4434e6c1e2bb5283d8",
		"name": "mistralai/Mixtral-8x7B-Instruct-v0.1",
		"display_name": "Mixtral-8x7B Instruct",
		"display_type": "chat",
		"description": "The Mixtral-8x7B Large Language Model (LLM) is a pretrained generative Sparse Mixture of Experts.",
		"license": "apache-2.0",
		"link": "https://huggingface.co/mistralai/Mixtral-8x7B-Instruct-v0.1",
		"creator_organization": "mistralai",
		"pricing_tier": "Featured",
		"access": "open",
		"num_parameters": "56000000000",
		"show_in_playground": true,
		"isFeaturedModel": true,
		"context_length": 32768,
		"config": {
			"prompt_format": "[INST] {prompt} [/INST]",
			"stop": [
				"[/INST]",
				"</s>"
			],
			"chat_template_name": "llama"
		},
		"pricing": {
			"input": 150,
			"output": 150,
			"hourly": 0
		},
		"created_at": "2023-12-12T00:54:28.108Z",
		"update_at": "2023-12-12T00:54:28.108Z",
		"instances": [
			{
				"avzone": "us-east-1a",
				"cluster": "happypiglet"
			}
		],
		"hardware_label": "",
		"descriptionLink": "",
		"depth": {
			"num_asks": 6,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x271897e255fa603F3D1e015097753D0F9D732562": 1,
				"0x5CDBce91751B38E9572Bc62ED73Dd643Aa34ae62": 1,
				"0xD2BAa9E93F68007EDF40542aF25a748899868633": 1,
				"0xD9ce22F32c24De59044E39d237425D5FCe05A062": 1,
				"0xDc9eC92901CC735e1a023a32915B5Cbfb507a274": 1,
				"0xd52d9FE2201325ab370219d5d3Fdd6310FD0D423": 1
			},
			"asks_updated": "2024-01-12T05:04:09.434352867Z",
			"gpus": {
				"": 0
			},
			"qps": 4.866666666666666,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 7317.2,
			"throughput_out": 1077.0666666666666,
			"error_rate": 0.06666666666666667,
			"stats": [
				{
					"avzone": "us-east-1a",
					"cluster": "happypiglet",
					"capacity": 0.17681380010147135,
					"qps": 4.866666666666666,
					"throughput_in": 7317.2,
					"throughput_out": 1077.0666666666666,
					"error_rate": 0.06666666666666667,
					"retry_rate": 0
				}
			]
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "657b7a2a84ef58c3562de91e",
		"name": "openchat/openchat-3.5-1210",
		"display_name": "OpenChat 3.5",
		"display_type": "chat",
		"description": "A merge of OpenChat 3.5 was trained with C-RLFT on a collection of publicly available high-quality instruction data, with a custom processing pipeline.",
		"license": "apache-2.0",
		"link": "https://huggingface.co/openchat/openchat-3.5-1210",
		"creator_organization": "OpenChat",
		"pricing_tier": "Featured",
		"access": "open",
		"num_parameters": "7000000000",
		"show_in_playground": true,
		"isFeaturedModel": true,
		"context_length": 8192,
		"config": {
			"chat_template": "{{ bos_token }}{% for message in messages %}{{ 'GPT4 Correct ' + message['role'] + ': ' + message['content'] + '<|end_of_turn|>'}}{% endfor %}{% if add_generation_prompt %}{{ 'GPT4 Correct Assistant:' }}{% endif %}",
			"stop": [
				"<|end_of_turn|>",
				"</s>"
			],
			"add_generation_prompt": true,
			"bos_token": "<s>",
			"prompt_format": "GPT4 Correct User: {prompt}<|end_of_turn|>GPT4 Correct Assistant:"
		},
		"pricing": {
			"input": 50,
			"output": 50,
			"hourly": 0
		},
		"created_at": "2023-12-14T21:56:58.576Z",
		"update_at": "2023-12-14T21:56:58.576Z",
		"instances": [
			{
				"avzone": "us-east-1a",
				"cluster": "happypiglet"
			}
		],
		"hardware_label": "",
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0xdca756a6345927b0D0e013dE3A640a23bff12cBe": 1
			},
			"asks_updated": "2024-01-12T01:31:53.104290956Z",
			"gpus": {
				"": 0
			},
			"qps": 0,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"stats": [
				{
					"avzone": "us-east-1a",
					"cluster": "happypiglet",
					"capacity": 0.010416666666666666,
					"qps": 0,
					"throughput_in": 0,
					"throughput_out": 0,
					"error_rate": 0,
					"retry_rate": 0
				}
			]
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64aced5c227f790586239d2b",
		"name": "prompthero/openjourney",
		"display_name": "Openjourney v4",
		"display_type": "image",
		"description": "An open source Stable Diffusion model fine tuned model on Midjourney images. ",
		"license": "creativeml-openrail-m",
		"link": "https://huggingface.co/prompthero/openjourney",
		"creator_organization": "Prompt Hero",
		"hardware_label": "A40 48GB",
		"pricing_tier": "featured",
		"access": "open",
		"num_parameters": 13000000000,
		"show_in_playground": true,
		"isFeaturedModel": true,
		"external_pricing_url": "https://www.together.xyz/apis#pricing",
		"config": {
			"height": 512,
			"width": 512,
			"steps": 20,
			"number_of_images": 2,
			"seed": 42
		},
		"pricing": {
			"input": 75,
			"output": 75,
			"hourly": 0
		},
		"created_at": "2023-07-11T05:49:16.586Z",
		"update_at": "2023-07-11T05:49:16.586Z",
		"descriptionLink": "",
		"depth": {
			"num_asks": 2,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x5C5b60Ea2C7046FDdf7F7be3853d046301334a85": 1,
				"0xB2bFeaa446Cc0376249ed2d7a8f5C32E0705e556": 1
			},
			"asks_updated": "2024-01-12T04:04:35.838647129Z",
			"gpus": {
				"NVIDIA A40": 2
			},
			"options": {
				"input=text,image": 2
			},
			"qps": 0.019759923,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 0.3987558
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "6495ff1312907e072b8aece1",
		"name": "runwayml/stable-diffusion-v1-5",
		"display_name": "Stable Diffusion 1.5",
		"display_type": "image",
		"description": "Latent text-to-image diffusion model capable of generating photo-realistic images given any text input.",
		"license": "creativeml-openrail-m",
		"link": "https://huggingface.co/runwayml/stable-diffusion-v1-5",
		"creator_organization": "Runway ML",
		"hardware_label": "A100 80GB",
		"pricing_tier": "featured",
		"show_in_playground": true,
		"isFeaturedModel": true,
		"external_pricing_url": "https://www.together.xyz/apis#pricing",
		"config": {
			"height": 512,
			"width": 512,
			"steps": 20,
			"number_of_images": 2,
			"seed": 42
		},
		"created_at": "2023-06-23T20:22:43.572Z",
		"update_at": "2023-06-23T20:22:43.572Z",
		"access": "",
		"descriptionLink": "",
		"pricing": {
			"hourly": 0,
			"input": 0,
			"output": 0,
			"base": 0,
			"finetune": 0
		},
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x98D41CFC96e488D9810431B65Aa98EBfc87b73c8": 1
			},
			"asks_updated": "2024-01-12T04:43:33.44039265Z",
			"gpus": {
				"NVIDIA A40": 1
			},
			"options": {
				"input=text,image": 1
			},
			"qps": 0.023330977,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 0.47052926
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64acef00227f790586239d3b",
		"name": "stabilityai/stable-diffusion-2-1",
		"display_name": "Stable Diffusion 2.1",
		"display_type": "image",
		"description": "Latent text-to-image diffusion model capable of generating photo-realistic images given any text input.",
		"license": "openrail++",
		"link": "https://huggingface.co/stabilityai/stable-diffusion-2-1",
		"creator_organization": "Stability AI",
		"hardware_label": "A100 80GB",
		"pricing_tier": "featured",
		"show_in_playground": true,
		"isFeaturedModel": true,
		"external_pricing_url": "https://www.together.xyz/apis#pricing",
		"created_at": "2023-06-23T20:22:43.572Z",
		"update_at": "2023-06-23T20:22:43.572Z",
		"access": "",
		"descriptionLink": "",
		"pricing": {
			"hourly": 0,
			"input": 0,
			"output": 0,
			"base": 0,
			"finetune": 0
		},
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0xC9494f3A014EAC6DD43De5b03E03364F1AcC9ea7": 1
			},
			"asks_updated": "2024-01-12T10:53:48.356359536Z",
			"gpus": {
				"NVIDIA A100 80GB PCIe": 1
			},
			"options": {
				"input=text,image": 1
			},
			"qps": 0.011744807,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 0.23914562
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64c9890c689aa3b286cfcff9",
		"name": "stabilityai/stable-diffusion-xl-base-1.0",
		"display_name": "Stable Diffusion XL 1.0",
		"display_type": "image",
		"description": "A text-to-image generative AI model that excels at creating 1024x1024 images.",
		"license": "openrail++",
		"link": "https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0",
		"creator_organization": "Stability AI",
		"hardware_label": "A100 80GB",
		"pricing_tier": "featured",
		"access": "open",
		"show_in_playground": true,
		"isFeaturedModel": true,
		"external_pricing_url": "https://www.together.xyz/apis#pricing",
		"config": {
			"seed": 1000,
			"height": 1024,
			"width": 1024,
			"steps": 40,
			"number_of_images": 4
		},
		"created_at": "2023-08-01T22:37:00.851Z",
		"update_at": "2023-08-01T22:37:00.851Z",
		"descriptionLink": "",
		"pricing": {
			"hourly": 0,
			"input": 0,
			"output": 0,
			"base": 0,
			"finetune": 0
		},
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x2E595c6ee5e62FeFF9f426b239a2fB0970476593": 1
			},
			"asks_updated": "2024-01-12T05:21:37.750980711Z",
			"gpus": {
				"NVIDIA A100 80GB PCIe": 1
			},
			"options": {
				"input=text,image": 1
			},
			"qps": 0.026987417,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 0.3281115
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "653c053fd9679a84df55c4e7",
		"name": "teknium/OpenHermes-2-Mistral-7B",
		"display_name": "OpenHermes-2-Mistral (7B)",
		"display_type": "chat",
		"description": "State of the art Mistral Fine-tuned on extensive public datasets",
		"license": "Apache-2",
		"creator_organization": "teknium",
		"hardware_label": "A40",
		"pricing_tier": "Featured",
		"num_parameters": 7241732096,
		"release_date": "2023-10-27T00:00:00.000Z",
		"show_in_playground": true,
		"isFeaturedModel": true,
		"config": {
			"stop": [
				"<|im_end|>",
				"<|im_start|>"
			],
			"prompt_format": "<|im_start|>user\n{prompt}<|im_end|>\n<|im_start|>assistant\n",
			"pre_prompt": "<|im_start|>system\nYou are thoughtful, helpful, polite, honest, and friendly<|im_end|>\n",
			"add_generation_prompt": true,
			"chat_template_name": "default"
		},
		"pricing": {
			"input": 50,
			"output": 50,
			"hourly": 0
		},
		"created_at": "2023-10-27T18:45:19.307Z",
		"update_at": "2023-10-27T23:53:05.438Z",
		"instances": [
			{
				"avzone": "us-east-2a",
				"cluster": "jumpyjackal"
			},
			{
				"avzone": "us-central-1a",
				"cluster": "sassyseal"
			},
			{
				"avzone": "us-central-5a",
				"cluster": "wrigleycub"
			}
		],
		"access": "",
		"link": "",
		"descriptionLink": "",
		"depth": {
			"num_asks": 2,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x0916A27F8b14De53BE968F395dFb041b1564d828": 1,
				"0x9f850AC6941891f0ce2893F67f97DBc0f3839cDB": 1,
				"0xA59b2541da93726954C2F250d438b17Dc15E2F7E": 1,
				"0xD451BB68A5Af1dB8d287668Fa5640dEA160e4922": 1
			},
			"asks_updated": "2024-01-12T10:50:05.91997416Z",
			"gpus": {
				"": 0
			},
			"qps": 0.33333333333333337,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 311.8666666666667,
			"throughput_out": 36.86666666666667,
			"stats": [
				{
					"avzone": "us-east-2a",
					"cluster": "jumpyjackal",
					"capacity": 0.06363636363636363,
					"qps": 0,
					"throughput_in": 0,
					"throughput_out": 0,
					"error_rate": 0,
					"retry_rate": 0
				},
				{
					"avzone": "us-central-1a",
					"cluster": "sassyseal",
					"capacity": 0.1363636363636364,
					"qps": 0.2,
					"throughput_in": 182.06666666666666,
					"throughput_out": 29.466666666666665,
					"error_rate": 0,
					"retry_rate": 0
				},
				{
					"avzone": "us-central-5a",
					"cluster": "wrigleycub",
					"capacity": 0.1527777777777778,
					"qps": 0.13333333333333333,
					"throughput_in": 129.8,
					"throughput_out": 7.4,
					"error_rate": 0,
					"retry_rate": 0
				}
			]
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "655667fe6664bf7229b2dc6c",
		"name": "teknium/OpenHermes-2p5-Mistral-7B",
		"display_name": "OpenHermes-2.5-Mistral (7B)",
		"display_type": "chat",
		"description": "Continuation of OpenHermes 2 Mistral model trained on additional code datasets",
		"license": "Apache-2",
		"creator_organization": "teknium",
		"hardware_label": "A40",
		"pricing_tier": "Featured",
		"num_parameters": 7241732096,
		"release_date": "2023-11-15T00:00:00.000Z",
		"show_in_playground": true,
		"finetuning_supported": true,
		"isFeaturedModel": true,
		"config": {
			"stop": [
				"<|im_end|>",
				"<|im_start|>"
			],
			"prompt_format": "<|im_start|>user\n{prompt}<|im_end|>\n<|im_start|>assistant\n",
			"add_generation_prompt": true,
			"chat_template_name": "default"
		},
		"pricing": {
			"input": 50,
			"output": 50
		},
		"created_at": "2023-11-16T19:05:34.976Z",
		"update_at": "2023-11-16T19:12:24.883Z",
		"instances": [
			{
				"avzone": "us-east-2a",
				"cluster": "jumpyjackal"
			}
		],
		"access": "",
		"link": "",
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0xDf50D0d525ba07B0faf17AbB686cFb7684804Dd4": 1
			},
			"asks_updated": "2024-01-12T08:01:14.535733964Z",
			"gpus": {
				"": 0
			},
			"qps": 1.6,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 1709.4666666666667,
			"throughput_out": 288.6666666666667,
			"stats": [
				{
					"avzone": "us-east-2a",
					"cluster": "jumpyjackal",
					"capacity": 0.1505145797598629,
					"qps": 1.6,
					"throughput_in": 1709.4666666666667,
					"throughput_out": 288.6666666666667,
					"error_rate": 0,
					"retry_rate": 0
				}
			]
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64e78eba589782acafe17820",
		"name": "togethercomputer/CodeLlama-13b-Instruct",
		"display_name": "Code Llama Instruct (13B)",
		"display_type": "chat",
		"description": "Code Llama is a family of large language models for code based on Llama 2 providing infilling capabilities, support for large input contexts, and zero-shot instruction following ability for programming tasks.",
		"license": "LLAMA 2 Community license Agreement (Meta)",
		"creator_organization": "Meta",
		"hardware_label": "A100 80GB",
		"num_parameters": "13016028160",
		"show_in_playground": true,
		"finetuning_supported": true,
		"isFeaturedModel": true,
		"context_length": 16384,
		"config": {
			"prompt_format": "[INST] {prompt} [/INST]",
			"stop": [
				"</s>",
				"[INST]"
			],
			"chat_template_name": "llama"
		},
		"pricing": {
			"input": 55,
			"output": 55,
			"hourly": 0
		},
		"created_at": "2023-08-24T17:09:14.381Z",
		"update_at": "2023-12-04T05:01:42.539Z",
		"instances": [
			{
				"avzone": "us-central-2a",
				"cluster": "jollyllama"
			},
			{
				"avzone": "us-central-1a",
				"cluster": "sassyseal"
			}
		],
		"access": "",
		"link": "",
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x7f3EB57bA165aB305BC58649566c89861758C852": 1,
				"0xB9CA93c8Ed8eeb43Ab281d30345714F729878919": 1
			},
			"asks_updated": "2024-01-12T05:21:20.832588763Z",
			"gpus": {
				"": 0
			},
			"qps": 0,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"stats": [
				{
					"avzone": "us-central-2a",
					"cluster": "jollyllama",
					"capacity": 0.14285714285714285,
					"qps": 0,
					"throughput_in": 0,
					"throughput_out": 0,
					"error_rate": 0,
					"retry_rate": 0
				},
				{
					"avzone": "us-central-1a",
					"cluster": "sassyseal",
					"capacity": 0.14285714285714285,
					"qps": 0,
					"throughput_in": 0,
					"throughput_out": 0,
					"error_rate": 0,
					"retry_rate": 0
				}
			]
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64e78eba589782acafe1781f",
		"name": "togethercomputer/CodeLlama-13b-Python",
		"display_name": "Code Llama Python (13B)",
		"display_type": "code",
		"description": "Code Llama is a family of large language models for code based on Llama 2 providing infilling capabilities, support for large input contexts, and zero-shot instruction following ability for programming tasks.",
		"license": "LLAMA 2 Community license Agreement (Meta)",
		"creator_organization": "Meta",
		"hardware_label": "A100 80GB",
		"num_parameters": "13016028160",
		"show_in_playground": true,
		"finetuning_supported": true,
		"isFeaturedModel": true,
		"context_length": 16384,
		"config": {
			"stop": [
				"</s>"
			],
			"chat_template_name": "llama"
		},
		"pricing": {
			"input": 55,
			"output": 55,
			"hourly": 0
		},
		"created_at": "2023-08-24T17:09:14.381Z",
		"update_at": "2023-12-20T22:52:59.177Z",
		"instances": [
			{
				"avzone": "us-central-1a",
				"cluster": "sassyseal"
			}
		],
		"access": "",
		"link": "",
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x9e64C206d828Fa5E9beC546FB0d8C115E6Ef264c": 1
			},
			"asks_updated": "2024-01-12T05:13:11.356971543Z",
			"gpus": {
				"": 0
			},
			"qps": 0,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"stats": [
				{
					"avzone": "us-central-1a",
					"cluster": "sassyseal",
					"capacity": 0.19047619047619047,
					"qps": 0,
					"throughput_in": 0,
					"throughput_out": 0,
					"error_rate": 0,
					"retry_rate": 0
				}
			]
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64e78eba589782acafe1781e",
		"name": "togethercomputer/CodeLlama-13b",
		"display_name": "Code Llama (13B)",
		"display_type": "code",
		"description": "Code Llama is a family of large language models for code based on Llama 2 providing infilling capabilities, support for large input contexts, and zero-shot instruction following ability for programming tasks.",
		"license": "LLAMA 2 Community license Agreement (Meta)",
		"creator_organization": "Meta",
		"hardware_label": "A100 80GB",
		"num_parameters": "13016028160",
		"show_in_playground": true,
		"finetuning_supported": true,
		"isFeaturedModel": true,
		"context_length": 16384,
		"config": {
			"stop": [
				"</s>"
			],
			"chat_template_name": "llama"
		},
		"pricing": {
			"input": 55,
			"output": 55,
			"hourly": 0
		},
		"created_at": "2023-08-24T17:09:14.381Z",
		"update_at": "2023-12-21T01:12:38.916Z",
		"instances": [
			{
				"avzone": "us-central-1a",
				"cluster": "sassyseal"
			}
		],
		"access": "",
		"link": "",
		"descriptionLink": "",
		"depth": {
			"num_asks": 2,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0xBEAaD56Bd33DB9bE9Eb4bcDa6C28174a2eCa8cdc": 1,
				"0xCe0c92fE8e92cb46Afb6fAFc6Eef015b0c097CDb": 1
			},
			"asks_updated": "2024-01-12T05:18:30.468121652Z",
			"gpus": {
				"": 0
			},
			"qps": 0,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"stats": [
				{
					"avzone": "us-central-1a",
					"cluster": "sassyseal",
					"capacity": 0.19047619047619047,
					"qps": 0,
					"throughput_in": 0,
					"throughput_out": 0,
					"error_rate": 0,
					"retry_rate": 0
				}
			]
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64e7934a589782acafe17823",
		"name": "togethercomputer/CodeLlama-34b-Instruct",
		"display_name": "Code Llama Instruct (34B)",
		"display_type": "chat",
		"description": "Code Llama is a family of large language models for code based on Llama 2 providing infilling capabilities, support for large input contexts, and zero-shot instruction following ability for programming tasks.",
		"license": "LLAMA 2 Community license Agreement (Meta)",
		"creator_organization": "Meta",
		"hardware_label": "A100 80GB",
		"num_parameters": 34000000000,
		"show_in_playground": true,
		"isFeaturedModel": true,
		"context_length": 16384,
		"config": {
			"prompt_format": "[INST] {prompt} [/INST]",
			"stop": [
				"</s>",
				"[INST]"
			],
			"chat_template_name": "llama"
		},
		"pricing": {
			"input": 200,
			"output": 200,
			"hourly": 0
		},
		"created_at": "2023-08-24T17:28:42.172Z",
		"update_at": "2023-08-24T17:28:42.172Z",
		"instances": [
			{
				"avzone": "us-central-1a",
				"cluster": "sassyseal"
			}
		],
		"access": "",
		"link": "",
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0xb0b3cB04544Cb6eA5D9A25761d836D1d0B8a12d6": 1
			},
			"asks_updated": "2024-01-12T05:19:49.960084914Z",
			"gpus": {
				"": 0
			},
			"qps": 0.13333333333333333,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 110.53333333333333,
			"throughput_out": 39.333333333333336,
			"stats": [
				{
					"avzone": "us-central-1a",
					"cluster": "sassyseal",
					"capacity": 0.2361111111111111,
					"qps": 0.13333333333333333,
					"throughput_in": 110.53333333333333,
					"throughput_out": 39.333333333333336,
					"error_rate": 0,
					"retry_rate": 0
				}
			]
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64e7934a589782acafe17822",
		"name": "togethercomputer/CodeLlama-34b-Python",
		"display_name": "Code Llama Python (34B)",
		"display_type": "code",
		"description": "Code Llama is a family of large language models for code based on Llama 2 providing infilling capabilities, support for large input contexts, and zero-shot instruction following ability for programming tasks.",
		"license": "LLAMA 2 Community license Agreement (Meta)",
		"creator_organization": "Meta",
		"hardware_label": "A100 80GB",
		"num_parameters": 34000000000,
		"show_in_playground": true,
		"isFeaturedModel": true,
		"context_length": 16384,
		"config": {
			"stop": [
				"</s>"
			],
			"chat_template_name": "llama"
		},
		"pricing": {
			"input": 200,
			"output": 200,
			"hourly": 0
		},
		"created_at": "2023-08-24T17:28:42.172Z",
		"update_at": "2023-08-24T17:28:42.172Z",
		"instances": [
			{
				"avzone": "us-central-1a",
				"cluster": "sassyseal"
			}
		],
		"access": "",
		"link": "",
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x64AA865eDF00dfed7AEE6D0F01389ea0bffD5B1b": 1
			},
			"asks_updated": "2024-01-12T00:20:36.781704445Z",
			"gpus": {
				"": 0
			},
			"qps": 0,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"stats": [
				{
					"avzone": "us-central-1a",
					"cluster": "sassyseal",
					"capacity": 0.06666666666666667,
					"qps": 0,
					"throughput_in": 0,
					"throughput_out": 0,
					"error_rate": 0,
					"retry_rate": 0
				}
			]
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64e7934a589782acafe17821",
		"name": "togethercomputer/CodeLlama-34b",
		"display_name": "Code Llama (34B)",
		"display_type": "code",
		"description": "Code Llama is a family of large language models for code based on Llama 2 providing infilling capabilities, support for large input contexts, and zero-shot instruction following ability for programming tasks.",
		"license": "LLAMA 2 Community license Agreement (Meta)",
		"creator_organization": "Meta",
		"hardware_label": "A100 80GB",
		"num_parameters": 34000000000,
		"show_in_playground": true,
		"isFeaturedModel": true,
		"context_length": 16384,
		"config": {
			"stop": [
				"</s>"
			],
			"chat_template_name": "llama"
		},
		"pricing": {
			"input": 200,
			"output": 200,
			"hourly": 0
		},
		"created_at": "2023-08-24T17:28:42.172Z",
		"update_at": "2023-08-24T17:28:42.172Z",
		"instances": [
			{
				"avzone": "us-central-1a",
				"cluster": "sassyseal"
			}
		],
		"access": "",
		"link": "",
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0xd17Ac95C32E42931b74FC8A259700F98Bedd82a6": 1
			},
			"asks_updated": "2024-01-12T04:01:43.185202965Z",
			"gpus": {
				"": 0
			},
			"qps": 0,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"stats": [
				{
					"avzone": "us-central-1a",
					"cluster": "sassyseal",
					"capacity": 0.09999999999999999,
					"qps": 0,
					"throughput_in": 0,
					"throughput_out": 0,
					"error_rate": 0,
					"retry_rate": 0
				}
			]
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64e78e89589782acafe1781d",
		"name": "togethercomputer/CodeLlama-7b-Instruct",
		"display_name": "Code Llama Instruct (7B)",
		"display_type": "chat",
		"description": "Code Llama is a family of large language models for code based on Llama 2 providing infilling capabilities, support for large input contexts, and zero-shot instruction following ability for programming tasks.",
		"license": "LLAMA 2 Community license Agreement (Meta)",
		"creator_organization": "Meta",
		"hardware_label": "A100 80GB",
		"num_parameters": "6738546688",
		"show_in_playground": true,
		"finetuning_supported": true,
		"isFeaturedModel": true,
		"context_length": 16384,
		"config": {
			"prompt_format": "[INST] {prompt} [/INST]",
			"stop": [
				"</s>",
				"[INST]"
			],
			"chat_template_name": "llama"
		},
		"pricing": {
			"input": 50,
			"output": 50,
			"hourly": 0
		},
		"created_at": "2023-08-24T17:08:25.379Z",
		"update_at": "2023-08-24T17:08:25.379Z",
		"access": "",
		"link": "",
		"descriptionLink": "",
		"depth": {
			"num_asks": 2,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x5216d6CA97cACeD33b1090433fEb1e83886406C2": 1,
				"0x85efbC73601981Ffd34e777359b36b145a56048F": 1
			},
			"asks_updated": "2024-01-12T10:54:24.410047879Z",
			"gpus": {
				"": 0
			},
			"qps": 0.07490195,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 78.443436,
			"throughput_out": 8.057548
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64e78e89589782acafe1781c",
		"name": "togethercomputer/CodeLlama-7b-Python",
		"display_name": "Code Llama Python (7B)",
		"display_type": "code",
		"description": "Code Llama is a family of large language models for code based on Llama 2 providing infilling capabilities, support for large input contexts, and zero-shot instruction following ability for programming tasks.",
		"license": "LLAMA 2 Community license Agreement (Meta)",
		"creator_organization": "Meta",
		"hardware_label": "A100 80GB",
		"num_parameters": "6738546688",
		"show_in_playground": true,
		"finetuning_supported": true,
		"isFeaturedModel": true,
		"context_length": 16384,
		"config": {
			"stop": [
				"</s>"
			],
			"chat_template_name": "llama"
		},
		"pricing": {
			"input": 50,
			"output": 50,
			"hourly": 0
		},
		"created_at": "2023-08-24T17:08:25.379Z",
		"update_at": "2023-08-24T17:08:25.379Z",
		"access": "",
		"link": "",
		"descriptionLink": "",
		"depth": {
			"num_asks": 2,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x8ff44C68db56E66E200C6a7a51740d09D18Cd93b": 1,
				"0xfdf5757441d96F33A8a3e1D08D6ca4D1E3e1D12e": 1
			},
			"asks_updated": "2024-01-12T05:18:15.889292078Z",
			"gpus": {
				"": 0
			},
			"qps": 0.057282627,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 3.714627,
			"throughput_out": 21.191435
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64e78e89589782acafe1781b",
		"name": "togethercomputer/CodeLlama-7b",
		"display_name": "Code Llama (7B)",
		"display_type": "code",
		"description": "Code Llama is a family of large language models for code based on Llama 2 providing infilling capabilities, support for large input contexts, and zero-shot instruction following ability for programming tasks.",
		"license": "LLAMA 2 Community license Agreement (Meta)",
		"creator_organization": "Meta",
		"hardware_label": "A100 80GB",
		"num_parameters": "6738546688",
		"show_in_playground": true,
		"finetuning_supported": true,
		"isFeaturedModel": true,
		"context_length": 16384,
		"config": {
			"stop": [
				"</s>"
			],
			"chat_template_name": "llama"
		},
		"pricing": {
			"input": 50,
			"output": 50,
			"hourly": 0
		},
		"created_at": "2023-08-24T17:08:25.379Z",
		"update_at": "2023-08-24T17:08:25.379Z",
		"access": "",
		"link": "",
		"descriptionLink": "",
		"depth": {
			"num_asks": 2,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x2529004E1F328c64aefE70d0a78BC636f9a10C67": 1,
				"0xEDA1b10361ce070fea99CF46A4738BD9f4CC52c2": 1
			},
			"asks_updated": "2024-01-12T10:35:39.259312754Z",
			"gpus": {
				"": 0
			},
			"qps": 0.042529367,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 0.8232049,
			"throughput_out": 1.3809674
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "6495ff1312907e072b8aece2",
		"name": "togethercomputer/GPT-JT-6B-v1",
		"display_name": "GPT-JT (6B)",
		"display_type": "language",
		"description": "Fork of GPT-J instruction tuned to excel at few-shot prompts (blog post).",
		"descriptionLink": "https://www.together.xyz/blog/releasing-v1-of-gpt-jt-powered-by-open-source-ai",
		"license": "apache-2.0",
		"link": "https://huggingface.co/togethercomputer/GPT-JT-6B-v1",
		"creator_organization": "Together",
		"hardware_label": "A40 48GB",
		"pricing_tier": "featured",
		"access": "open",
		"num_parameters": 6700000000,
		"release_date": "2022-11-29T00:00:00.000Z",
		"show_in_playground": true,
		"isFeaturedModel": true,
		"context_length": 2048,
		"config": {
			"chat_template_name": "gpt"
		},
		"pricing": {
			"input": 50,
			"output": 50,
			"hourly": 0
		},
		"created_at": "2023-06-23T20:22:43.617Z",
		"update_at": "2023-06-23T20:22:43.617Z",
		"instances": [
			{
				"avzone": "us-central-1a",
				"cluster": "sassyseal"
			}
		],
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0xF459F9268226BbAcFbA88CbB4b5C7CF9756D5FC9": 1
			},
			"asks_updated": "2024-01-12T10:26:20.733053861Z",
			"gpus": {
				"": 0
			},
			"qps": 0,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"stats": [
				{
					"avzone": "us-central-1a",
					"cluster": "sassyseal",
					"capacity": 0.0078125,
					"qps": 0,
					"throughput_in": 0,
					"throughput_out": 0,
					"error_rate": 0,
					"retry_rate": 0
				}
			]
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "6495ff1312907e072b8aece3",
		"name": "togethercomputer/GPT-JT-Moderation-6B",
		"display_name": "GPT-JT-Moderation (6B)",
		"display_type": "language",
		"description": "This model can be used to moderate other chatbot models. Built using GPT-JT model fine-tuned on Ontocord.ai's OIG-moderation dataset v0.1.",
		"license": "apache-2.0",
		"link": "https://huggingface.co/togethercomputer/GPT-JT-Moderation-6B",
		"creator_organization": "Together",
		"hardware_label": "A40 48GB",
		"pricing_tier": "featured",
		"access": "open",
		"num_parameters": 6700000000,
		"show_in_playground": true,
		"isFeaturedModel": true,
		"context_length": 2048,
		"config": {
			"chat_template": "Possible labels:\n1. casual\n2. needs caution\n3. needs intervention\n4. possibly needs caution\n5. probably needs caution\nInput: Hi!\nOutput: casual\nInput: I want to kill my cat.\nOutput: needs intervention\nInput: How to poison my dog?\nOutput: needs intervention\nInput: I don't want to talk to my brother\nOutput: probably needs caution\nInput: Today we had a disagreement and  \nwe got into a screaming fight. I don't want to talk.\nOutput: probably needs caution\nInput: My brother is being an asshole... Fuck him.\nOutput: needs caution\nInput: Hello.\nOutput: casual\nInput: {% for message in messages %}{{ message.content }}{{ eos_token }}{% endfor %}\nOutput:",
			"safety_label": "casual",
			"safety_config": {
				"temperature": 0.2,
				"top_p": 1,
				"max_tokens": 10,
				"stop": [
					"\n"
				]
			}
		},
		"pricing": {
			"input": 50,
			"output": 50,
			"hourly": 0
		},
		"created_at": "2023-06-23T20:22:43.657Z",
		"update_at": "2023-06-23T20:22:43.657Z",
		"descriptionLink": "",
		"depth": {
			"num_asks": 2,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x6ab061898c6c0b6E7595BFa12c7d3F410a79D480": 1,
				"0xfDb481fb1949C07e4096111E92C426821516AC67": 1
			},
			"asks_updated": "2024-01-12T04:26:50.922390177Z",
			"gpus": {
				"NVIDIA A100 80GB PCIe": 2
			},
			"qps": 0.038443312,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 1.3218673,
			"throughput_out": 5.70541
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "6495ff1312907e072b8aece4",
		"name": "togethercomputer/GPT-NeoXT-Chat-Base-20B",
		"display_name": "GPT-NeoXT-Chat-Base (20B)",
		"display_type": "chat",
		"description": "Chat model fine-tuned from EleutherAI’s GPT-NeoX with over 40 million instructions on carbon reduced compute.",
		"license": "apache-2.0",
		"link": "https://huggingface.co/togethercomputer/GPT-NeoXT-Chat-Base-20B",
		"creator_organization": "Together",
		"hardware_label": "A40 48GB",
		"pricing_tier": "featured",
		"access": "open",
		"num_parameters": 20000000000,
		"show_in_playground": true,
		"isFeaturedModel": true,
		"context_length": 2048,
		"config": {
			"prompt_format": "<human>: {prompt}\n<bot>:",
			"stop": [
				"<human>"
			],
			"chat_template_name": "gpt"
		},
		"max_tokens": 995,
		"pricing": {
			"input": 75,
			"output": 75,
			"hourly": 0
		},
		"created_at": "2023-06-23T20:22:43.702Z",
		"update_at": "2023-06-23T20:22:43.702Z",
		"descriptionLink": "",
		"depth": {
			"num_asks": 2,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x0648b3363589FE937639A018781Ea6A1367AeDA3": 1,
				"0xF336AF86FBFf5dc323F0964f2DF9C8fE9ce804DB": 1
			},
			"asks_updated": "2024-01-12T10:47:21.537299561Z",
			"gpus": {
				"": 0
			},
			"qps": 0.040466625,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 0.8073917,
			"throughput_out": 2.8769805
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64c28e8742fa06a9511509d1",
		"name": "togethercomputer/LLaMA-2-7B-32K",
		"display_name": "LLaMA-2-32K (7B)",
		"display_type": "language",
		"description": "Extending LLaMA-2 to 32K context, built with Meta's Position Interpolation and Together AI's data recipe and system optimizations.",
		"license": "Meta license",
		"link": "https://huggingface.co/togethercomputer/LLaMA-2-7B-32K",
		"creator_organization": "Together",
		"hardware_label": "2x A100 80GB",
		"pricing_tier": "supported",
		"access": "open",
		"num_parameters": "6738415616",
		"show_in_playground": true,
		"finetuning_supported": true,
		"isFeaturedModel": true,
		"context_length": 32768,
		"config": {
			"stop": [
				"\n\n\n\n",
				"<|endoftext|>"
			],
			"chat_template_name": "llama"
		},
		"pricing": {
			"input": 50,
			"output": 50,
			"hourly": 0
		},
		"created_at": "2023-07-27T15:34:31.581Z",
		"update_at": "2023-08-17T17:07:36.346Z",
		"instances": [
			{
				"avzone": "us-east-2a",
				"cluster": "jumpyjackal"
			}
		],
		"descriptionLink": "",
		"depth": {
			"num_asks": 5,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x23493275B3aaA1F7EB20A1691e15Be3176b243ce": 1,
				"0x2d2015F17737ABAE1B8a8a5B68D0519B0a6Acc5B": 1,
				"0x332696C85E6c96e1218D958D0962E17CED8F6781": 1,
				"0x5DB0284816dc17477e27b55F9179CD9309036944": 1,
				"0xEf76FE343147D4D028295B8676c706337547e94F": 1
			},
			"asks_updated": "2024-01-12T09:32:19.7799055Z",
			"gpus": {
				"": 0
			},
			"qps": 0,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"stats": [
				{
					"avzone": "us-east-2a",
					"cluster": "jumpyjackal",
					"capacity": 0.5,
					"qps": 0,
					"throughput_in": 0,
					"throughput_out": 0,
					"error_rate": 0,
					"retry_rate": 0
				}
			]
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64de96090d052d10425df3c9",
		"name": "togethercomputer/Llama-2-7B-32K-Instruct",
		"display_name": "LLaMA-2-7B-32K-Instruct (7B)",
		"display_type": "chat",
		"description": "Extending LLaMA-2 to 32K context, built with Meta's Position Interpolation and Together AI's data recipe and system optimizations, instruction tuned by Together",
		"license": "Meta license",
		"link": "https://huggingface.co/togethercomputer/Llama-2-7B-32K-Instruct",
		"creator_organization": "Together",
		"hardware_label": "2X A100 80GB",
		"pricing_tier": "supported",
		"access": "open",
		"num_parameters": 7000000000,
		"show_in_playground": true,
		"finetuning_supported": true,
		"isFeaturedModel": true,
		"context_length": 32768,
		"config": {
			"prompt_format": "[INST]\n {prompt} \n[/INST]\n\n",
			"stop": [
				"[INST]",
				"\n\n"
			],
			"chat_template_name": "llama"
		},
		"pricing": {
			"input": 50,
			"output": 50,
			"hourly": 0
		},
		"created_at": "2023-07-27T15:34:31.581Z",
		"update_at": "2023-08-17T17:07:36.346Z",
		"instances": [
			{
				"avzone": "us-east-2a",
				"cluster": "jumpyjackal"
			}
		],
		"descriptionLink": "",
		"depth": {
			"num_asks": 5,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x1110687901f68af0c0d5F49A70C4eB82fcccB413": 1,
				"0x2D29C6a7e6C5b643788DF7C44C3cF39EC56aa0e8": 1,
				"0x5A7d176Ea006c9e5ea167CFe4d1DcaCF2c9ecBd4": 1,
				"0xECD06B9E88Fa7f2F45c1cc7f6008A2C308024aC0": 1,
				"0xc7b7d32D5dabe3C955Af54065F62a7267E98E534": 1
			},
			"asks_updated": "2024-01-12T10:53:43.6437532Z",
			"gpus": {
				"": 0
			},
			"qps": 0,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"stats": [
				{
					"avzone": "us-east-2a",
					"cluster": "jumpyjackal",
					"capacity": 0.5,
					"qps": 0,
					"throughput_in": 0,
					"throughput_out": 0,
					"error_rate": 0,
					"retry_rate": 0
				}
			]
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "6495ff1412907e072b8aecee",
		"name": "togethercomputer/Pythia-Chat-Base-7B-v0.16",
		"display_name": "Pythia-Chat-Base (7B)",
		"display_type": "chat",
		"description": "Chat model based on EleutherAI’s Pythia-7B model, and is fine-tuned with data focusing on dialog-style interactions.",
		"license": "apache-2.0",
		"creator_organization": "Together",
		"hardware_label": "A40 48GB",
		"pricing_tier": "featured",
		"access": "open",
		"num_parameters": 7000000000,
		"show_in_playground": true,
		"finetuning_supported": true,
		"isFeaturedModel": true,
		"context_length": 2048,
		"config": {
			"prompt_format": "<human>: {prompt}\n<bot>:",
			"stop": [
				"<human>"
			],
			"chat_template_name": "gpt"
		},
		"pricing": {
			"input": 50,
			"output": 50,
			"hourly": 0
		},
		"created_at": "2023-06-23T20:22:44.251Z",
		"update_at": "2023-06-23T20:22:44.251Z",
		"link": "",
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x42899d444e0669B867ECa64983143469F097D9c5": 1
			},
			"asks_updated": "2024-01-12T03:11:02.390410995Z",
			"gpus": {
				"": 0
			},
			"qps": 0.025978047,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 0.3994765,
			"throughput_out": 2.5004354
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64efd5511b76196fc5a54872",
		"name": "togethercomputer/Qwen-7B-Chat",
		"display_name": "Qwen-Chat (7B)",
		"display_type": "chat",
		"description": "7B-parameter version of the large language model series, Qwen (abbr. Tongyi Qianwen), proposed by Aibaba Cloud. Qwen-7B-Chat is a large-model-based AI assistant, which is trained with alignment techniques.   ",
		"license": "Tongyi Qianwen LICENSE AGREEMENT",
		"creator_organization": "Qwen",
		"hardware_label": "1x A100 80GB",
		"num_parameters": 7000000000,
		"release_date": "2023-08-01T00:00:00.000Z",
		"show_in_playground": true,
		"isFeaturedModel": true,
		"context_length": 8192,
		"config": {
			"stop": [
				"<|im_end|>",
				"<|im_start|>"
			],
			"prompt_format": "\n<|im_start|>user\n{prompt}<|im_end|>\n<|im_start|>assistant\n",
			"add_generation_prompt": true,
			"chat_template_name": "default"
		},
		"pricing": {
			"input": 50,
			"output": 50,
			"hourly": 0
		},
		"created_at": "2023-08-30T23:48:33.852Z",
		"update_at": "2023-09-07T01:49:42.840Z",
		"instances": [
			{
				"avzone": "us-east-2a",
				"cluster": "jumpyjackal"
			}
		],
		"access": "",
		"link": "",
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x3CA68fF3313821F606d5BA2590cd7BF7a2244fcc": 1
			},
			"asks_updated": "2024-01-12T03:51:17.610988004Z",
			"gpus": {
				"": 0
			},
			"qps": 0,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"stats": [
				{
					"avzone": "us-east-2a",
					"cluster": "jumpyjackal",
					"capacity": 0.0078125,
					"qps": 0,
					"throughput_in": 0,
					"throughput_out": 0,
					"error_rate": 0,
					"retry_rate": 0
				}
			]
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64efcc2a1b76196fc5a54870",
		"name": "togethercomputer/Qwen-7B",
		"display_name": "Qwen (7B)",
		"display_type": "language",
		"description": "7B-parameter version of the large language model series, Qwen (abbr. Tongyi Qianwen), proposed by Aibaba Cloud. Qwen-7B is a Transformer-based large language model, which is pretrained on a large volume of data, including web texts, books, codes, etc. ",
		"license": "Tongyi Qianwen LICENSE AGREEMENT",
		"creator_organization": "Qwen",
		"hardware_label": "1x A100 80GB",
		"num_parameters": 7000000000,
		"release_date": "2023-08-01T00:00:00.000Z",
		"show_in_playground": true,
		"isFeaturedModel": true,
		"context_length": 8192,
		"config": {
			"stop": [
				"<|im_end|>",
				"<|endoftext|>"
			],
			"add_generation_prompt": true,
			"chat_template_name": "default"
		},
		"pricing": {
			"input": 50,
			"output": 50,
			"hourly": 0
		},
		"created_at": "2023-08-30T23:09:30.570Z",
		"update_at": "2023-09-07T01:49:24.716Z",
		"instances": [
			{
				"avzone": "us-east-2a",
				"cluster": "jumpyjackal"
			}
		],
		"access": "",
		"link": "",
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0xa1206a2C43e3bA6b7E611523Fcc72539Af36d5bc": 1
			},
			"asks_updated": "2024-01-12T02:17:02.144994603Z",
			"gpus": {
				"": 0
			},
			"qps": 0,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"stats": [
				{
					"avzone": "us-east-2a",
					"cluster": "jumpyjackal",
					"capacity": 0.0078125,
					"qps": 0,
					"throughput_in": 0,
					"throughput_out": 0,
					"error_rate": 0,
					"retry_rate": 0
				}
			]
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "6495ff1412907e072b8aeceb",
		"name": "togethercomputer/RedPajama-INCITE-7B-Base",
		"display_name": "RedPajama-INCITE (7B)",
		"display_type": "language",
		"description": "Base model that aims to replicate the LLaMA recipe as closely as possible (blog post).",
		"descriptionLink": "https://www.together.xyz/blog/redpajama-models-v1",
		"license": "apache-2.0",
		"link": "https://huggingface.co/togethercomputer/RedPajama-INCITE-7B-Base",
		"creator_organization": "Together",
		"hardware_label": "A40 48GB",
		"pricing_tier": "featured",
		"access": "open",
		"num_parameters": "6857302016",
		"show_in_playground": true,
		"finetuning_supported": true,
		"isFeaturedModel": true,
		"context_length": 2048,
		"config": {
			"chat_template_name": "gpt"
		},
		"pricing": {
			"input": 50,
			"output": 50,
			"hourly": 0
		},
		"created_at": "2023-06-23T20:22:44.033Z",
		"update_at": "2023-06-23T20:22:44.033Z",
		"depth": {
			"num_asks": 2,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x7c7007A3ffF953bA357CF3eeF853DD8613B07209": 1,
				"0xa5c71572Cfa868Ef8616Bb33FccB05B49dA88d8B": 1
			},
			"asks_updated": "2024-01-12T04:14:34.81911547Z",
			"gpus": {
				"": 0
			},
			"qps": 0.037256252,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 0.7434852,
			"throughput_out": 1.5901525
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "6495ff1412907e072b8aeced",
		"name": "togethercomputer/RedPajama-INCITE-7B-Chat",
		"display_name": "RedPajama-INCITE Chat (7B)",
		"display_type": "chat",
		"description": "Chat model fine-tuned using data from Dolly 2.0 and Open Assistant over the RedPajama-INCITE-Base-7B-v1 base model.",
		"license": "apache-2.0",
		"link": "https://huggingface.co/togethercomputer/RedPajama-INCITE-7B-Chat",
		"creator_organization": "Together",
		"hardware_label": "A100 80GB",
		"pricing_tier": "featured",
		"access": "open",
		"num_parameters": "6857302016",
		"show_in_playground": true,
		"finetuning_supported": true,
		"isFeaturedModel": true,
		"context_length": 2048,
		"config": {
			"prompt_format": "<human>: {prompt}\n<bot>:",
			"stop": [
				"<human>"
			],
			"chat_template_name": "gpt"
		},
		"pricing": {
			"input": 50,
			"output": 50,
			"hourly": 0
		},
		"created_at": "2023-06-23T20:22:44.190Z",
		"update_at": "2023-06-23T20:22:44.190Z",
		"descriptionLink": "",
		"depth": {
			"num_asks": 3,
			"num_bids": 1,
			"num_running": 1,
			"asks": {
				"0xcC9323401A6f39efd3C5fc8bFAc74D7b512abd69": 2,
				"0xd21D8158D6065D9D38d68DEAcd5946F228499b16": 1
			},
			"asks_updated": "2024-01-12T10:54:15.292331839Z",
			"gpus": {
				"": 0
			},
			"qps": 0.1984789,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 43.50416,
			"throughput_out": 163.00926
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "6495ff1412907e072b8aecec",
		"name": "togethercomputer/RedPajama-INCITE-7B-Instruct",
		"display_name": "RedPajama-INCITE Instruct (7B)",
		"display_type": "language",
		"description": "Designed for few-shot prompts, fine-tuned over the RedPajama-INCITE-Base-7B-v1 base model.",
		"license": "apache-2.0",
		"link": "https://huggingface.co/togethercomputer/RedPajama-INCITE-7B-Instruct",
		"creator_organization": "Together",
		"hardware_label": "A100 80GB",
		"pricing_tier": "featured",
		"access": "open",
		"num_parameters": "6857302016",
		"show_in_playground": true,
		"finetuning_supported": true,
		"isFeaturedModel": true,
		"context_length": 2048,
		"config": {
			"chat_template_name": "gpt"
		},
		"pricing": {
			"input": 50,
			"output": 50,
			"hourly": 0
		},
		"created_at": "2023-06-23T20:22:44.083Z",
		"update_at": "2023-06-23T20:22:44.083Z",
		"descriptionLink": "",
		"depth": {
			"num_asks": 2,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x30D9d6EaFcA72F8913A8661450722E512bD06a9F": 1,
				"0xF68F3AfE6f0e6a29A16CB73cFB3BEb86E88Df043": 1
			},
			"asks_updated": "2024-01-12T10:44:03.260103917Z",
			"gpus": {
				"": 0
			},
			"qps": 0.029412098,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 0.51600116,
			"throughput_out": 1.8815347
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "6495ff1312907e072b8aece5",
		"name": "togethercomputer/RedPajama-INCITE-Base-3B-v1",
		"display_name": "RedPajama-INCITE (3B)",
		"display_type": "language",
		"description": "Base model that aims to replicate the LLaMA recipe as closely as possible (blog post).",
		"descriptionLink": "https://www.together.xyz/blog/redpajama-models-v1",
		"license": "apache-2.0",
		"link": "https://huggingface.co/togethercomputer/RedPajama-INCITE-Base-3B-v1",
		"creator_organization": "Together",
		"hardware_label": "A40 48GB",
		"pricing_tier": "featured",
		"access": "open",
		"num_parameters": "2775864320",
		"show_in_playground": true,
		"finetuning_supported": true,
		"isFeaturedModel": true,
		"context_length": 2048,
		"config": {
			"chat_template_name": "gpt"
		},
		"pricing": {
			"input": 25,
			"output": 25,
			"hourly": 0
		},
		"created_at": "2023-06-23T20:22:43.751Z",
		"update_at": "2023-06-23T20:22:43.751Z",
		"depth": {
			"num_asks": 2,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x0aBe21E3ca185164261ef34A239C247300ac8443": 1,
				"0x930312eb45cEDC07Ca1cFFf399e46693e1f6b0B9": 1
			},
			"asks_updated": "2024-01-12T04:46:05.262639186Z",
			"gpus": {
				"": 0
			},
			"qps": 0.024042346,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 0.36014554,
			"throughput_out": 1.5365028
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "6495ff1312907e072b8aece7",
		"name": "togethercomputer/RedPajama-INCITE-Chat-3B-v1",
		"display_name": "RedPajama-INCITE Chat (3B)",
		"display_type": "chat",
		"description": "Chat model fine-tuned using data from Dolly 2.0 and Open Assistant over the RedPajama-INCITE-Base-3B-v1 base model.",
		"license": "apache-2.0",
		"link": "https://huggingface.co/togethercomputer/RedPajama-INCITE-Chat-3B-v1",
		"creator_organization": "Together",
		"hardware_label": "A40 48GB",
		"pricing_tier": "featured",
		"access": "open",
		"num_parameters": "2775864320",
		"show_in_playground": true,
		"finetuning_supported": true,
		"isFeaturedModel": true,
		"context_length": 2048,
		"config": {
			"prompt_format": "<human>: {prompt}\n<bot>:",
			"stop": [
				"<human>"
			],
			"chat_template_name": "gpt"
		},
		"pricing": {
			"input": 25,
			"output": 25,
			"hourly": 0
		},
		"created_at": "2023-06-23T20:22:43.839Z",
		"update_at": "2023-06-23T20:22:43.839Z",
		"descriptionLink": "",
		"depth": {
			"num_asks": 2,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x314e601Ca3c385ade582C39Ea568fc5F93024899": 1,
				"0xE5CdaceFC11371aF54F4CEa9B825E299605fC0DB": 1
			},
			"asks_updated": "2024-01-12T08:19:23.004877794Z",
			"gpus": {
				"": 0
			},
			"qps": 0.033206347,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 1.8424233,
			"throughput_out": 12.33398
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "6495ff1312907e072b8aece6",
		"name": "togethercomputer/RedPajama-INCITE-Instruct-3B-v1",
		"display_name": "RedPajama-INCITE Instruct (3B)",
		"display_type": "language",
		"description": "Designed for few-shot prompts, fine-tuned over the RedPajama-INCITE-Base-3B-v1 base model.",
		"license": "apache-2.0",
		"link": "https://huggingface.co/togethercomputer/RedPajama-INCITE-Instruct-3B-v1",
		"creator_organization": "Together",
		"hardware_label": "A40 48GB",
		"pricing_tier": "featured",
		"access": "open",
		"num_parameters": "2775864320",
		"show_in_playground": true,
		"finetuning_supported": true,
		"isFeaturedModel": true,
		"context_length": 2048,
		"config": {
			"chat_template_name": "gpt"
		},
		"pricing": {
			"input": 25,
			"output": 25,
			"hourly": 0
		},
		"created_at": "2023-06-23T20:22:43.796Z",
		"update_at": "2023-06-23T20:22:43.796Z",
		"descriptionLink": "",
		"depth": {
			"num_asks": 2,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x9212cc97439F70f4a4611c5D93F37087d5DF111b": 1,
				"0xc627592f6023D78F544e7D643e5aF32c055EEA9D": 1
			},
			"asks_updated": "2024-01-12T10:43:29.906380554Z",
			"gpus": {
				"": 0
			},
			"qps": 0.026177688,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 0.4222854,
			"throughput_out": 0.9140853
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "65735df36923087ddd5a6607",
		"name": "togethercomputer/StripedHyena-Hessian-7B",
		"display_name": "StripedHyena Hessian (7B)",
		"display_type": "language",
		"description": "A hybrid architecture composed of multi-head, grouped-query attention and gated convolutions arranged in Hyena blocks, different from traditional decoder-only Transformers",
		"license": "Apache-2",
		"creator_organization": "Together",
		"hardware_label": "H100",
		"pricing_tier": "Featured",
		"num_parameters": 7000000000,
		"release_date": "2023-11-01T00:00:00.000Z",
		"show_in_playground": true,
		"isFeaturedModel": true,
		"pricing": {
			"input": 50,
			"output": 50
		},
		"created_at": "2023-12-08T18:18:27.005Z",
		"update_at": "2023-12-08T19:03:32.567Z",
		"instances": [
			{
				"avzone": "us-east-1a",
				"cluster": "happypiglet"
			}
		],
		"access": "",
		"link": "",
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0xE33189FB446fe8Bd78FCC02B99a08704b1410a96": 1
			},
			"asks_updated": "2024-01-12T04:39:14.585203503Z",
			"gpus": {
				"": 0
			},
			"qps": 0,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"stats": [
				{
					"avzone": "us-east-1a",
					"cluster": "happypiglet",
					"capacity": 0.024390243902439025,
					"qps": 0,
					"throughput_in": 0,
					"throughput_out": 0,
					"error_rate": 0,
					"retry_rate": 0
				}
			]
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "65735d536923087ddd5a6606",
		"name": "togethercomputer/StripedHyena-Nous-7B",
		"display_name": "StripedHyena Nous (7B)",
		"display_type": "chat",
		"description": "A hybrid architecture composed of multi-head, grouped-query attention and gated convolutions arranged in Hyena blocks, different from traditional decoder-only Transformers",
		"license": "Apache-2",
		"creator_organization": "Together",
		"hardware_label": "H100",
		"pricing_tier": "Featured",
		"num_parameters": 7000000000,
		"release_date": "2023-11-01T00:00:00.000Z",
		"show_in_playground": true,
		"isFeaturedModel": true,
		"config": {
			"stop": [
				"###",
				"</s>"
			],
			"prompt_format": "### Instruction:\n{prompt}\n\n### Response:",
			"chat_template": "{% for message in messages %}{% if message['role'] == 'user' %}{{ bos_token + '### Instruction:\\n' + message['content'] + '\\n\\n' }}{% elif message['role'] == 'system' %}{{ '### System:\\n' + message['content'] + '\\n\\n' }}{% elif message['role'] == 'assistant' %}{{ '### Response:\\n'  + message['content'] + '\\n' }}{% endif %}{% if loop.last %}{{ '### Response:\\n' }}{% endif %}{% endfor %}"
		},
		"pricing": {
			"input": 50,
			"output": 50
		},
		"created_at": "2023-12-08T18:15:47.433Z",
		"update_at": "2023-12-08T19:03:11.497Z",
		"instances": [
			{
				"avzone": "us-east-1a",
				"cluster": "happypiglet"
			}
		],
		"access": "",
		"link": "",
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0xc7D6248310276eb53B7d49843a7858e5A08F90BE": 1
			},
			"asks_updated": "2024-01-12T02:55:40.286161564Z",
			"gpus": {
				"": 0
			},
			"qps": 0,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"stats": [
				{
					"avzone": "us-east-1a",
					"cluster": "happypiglet",
					"capacity": 0.024390243902439025,
					"qps": 0,
					"throughput_in": 0,
					"throughput_out": 0,
					"error_rate": 0,
					"retry_rate": 0
				}
			]
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64ace317227f790586239ce2",
		"name": "togethercomputer/alpaca-7b",
		"display_name": "Alpaca (7B)",
		"display_type": "chat",
		"description": "Fine-tuned from the LLaMA 7B model on 52K instruction-following demonstrations. ",
		"license": "cc-by-nc-4.0",
		"link": "https://huggingface.co/tatsu-lab/alpaca-7b-wdiff",
		"creator_organization": "Stanford",
		"hardware_label": "A40 48GB",
		"pricing_tier": "supported",
		"access": "open",
		"num_parameters": 7000000000,
		"show_in_playground": true,
		"isFeaturedModel": true,
		"context_length": 2048,
		"config": {
			"stop": [
				"</s>",
				"###"
			],
			"prompt_format": "### Instruction:\n{prompt}\n### Response:\n",
			"chat_template": "{% for message in messages %}{% if message['role'] == 'user' %}{{ '### Instruction:\n' + message['content'] + '\n' }}{% else %}{{ '### Response:\n' + message['content'] + '\n' }}{% endif %}{% endfor %}{{ '### Response:\n' }}"
		},
		"pricing": {
			"input": 50,
			"output": 50,
			"hourly": 0
		},
		"created_at": "2023-07-11T05:05:27.713Z",
		"update_at": "2023-07-11T05:05:27.713Z",
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x4174A3c81710BCd6C43b1F8e8f8a91B1137Baf55": 1
			},
			"asks_updated": "2024-01-12T04:57:04.553368615Z",
			"gpus": {
				"": 0
			},
			"qps": 0.030366395,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 0.5470847,
			"throughput_out": 1.4369965
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64ace614227f790586239cf7",
		"name": "togethercomputer/falcon-40b-instruct",
		"display_name": "Falcon Instruct (40B)",
		"display_type": "chat",
		"description": "Falcon-40B-Instruct is a causal decoder-only model built by TII based on Falcon-40B and finetuned on a mixture of Baize. ",
		"license": "apache-2.0",
		"link": "https://huggingface.co/tiiuae/falcon-40b-instruct",
		"creator_organization": "TII UAE",
		"hardware_label": "2X A40 48GB",
		"pricing_tier": "supported",
		"access": "open",
		"num_parameters": 40000000000,
		"show_in_playground": true,
		"isFeaturedModel": true,
		"context_length": 2048,
		"config": {
			"prompt_format": "User: {prompt}\nAssistant:",
			"stop": [
				"User:",
				"</s>"
			],
			"chat_template_name": "default"
		},
		"pricing": {
			"input": 200,
			"output": 200,
			"hourly": 0
		},
		"created_at": "2023-07-11T05:18:12.323Z",
		"update_at": "2023-07-11T05:18:12.323Z",
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x0b5481F80C5DEe44b73CC49BA6091F6245545716": 1
			},
			"asks_updated": "2024-01-12T05:14:59.907454469Z",
			"gpus": {
				"": 0
			},
			"qps": 0.048925485,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 1.6858435,
			"throughput_out": 5.654552
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64ace59f227f790586239cf5",
		"name": "togethercomputer/falcon-40b",
		"display_name": "Falcon (40B)",
		"display_type": "language",
		"description": "Falcon-40B is a causal decoder-only model built by TII and trained on 1,000B tokens of RefinedWeb enhanced with curated corpora.",
		"license": "apache-2.0",
		"link": "https://huggingface.co/tiiuae/falcon-40b",
		"creator_organization": "TII UAE",
		"hardware_label": "2X A40 48GB",
		"pricing_tier": "supported",
		"access": "open",
		"num_parameters": 40000000000,
		"show_in_playground": true,
		"isFeaturedModel": true,
		"context_length": 2048,
		"config": {
			"stop": [
				"<|endoftext|>"
			],
			"chat_template_name": "default"
		},
		"pricing": {
			"input": 200,
			"output": 200,
			"hourly": 0
		},
		"created_at": "2023-07-11T05:16:15.898Z",
		"update_at": "2023-07-11T05:16:15.898Z",
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x42C59dDFA7fEF158a7d11a675317669893CE0EbC": 1
			},
			"asks_updated": "2024-01-12T03:03:49.211121235Z",
			"gpus": {
				"": 0
			},
			"qps": 0.123053744,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 608.0222,
			"throughput_out": 1.3262092
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64ace63d227f790586239cf8",
		"name": "togethercomputer/falcon-7b-instruct",
		"display_name": "Falcon Instruct (7B)",
		"display_type": "chat",
		"description": "Casual decoder-only model built by TII based on Falcon-7B and finetuned on a mixture of chat/instruct datasets. ",
		"license": "apache-2.0",
		"link": "https://huggingface.co/tiiuae/falcon-7b-instruct",
		"creator_organization": "TII UAE",
		"hardware_label": "A40 48GB",
		"pricing_tier": "featured",
		"access": "open",
		"num_parameters": 7000000000,
		"show_in_playground": true,
		"isFeaturedModel": true,
		"context_length": 2048,
		"config": {
			"prompt_format": "User: {prompt}\nAssistant:",
			"stop": [
				"User:",
				"</s>"
			],
			"chat_template_name": "default"
		},
		"pricing": {
			"input": 50,
			"output": 50,
			"hourly": 0
		},
		"created_at": "2023-07-11T05:18:53.623Z",
		"update_at": "2023-07-11T05:18:53.623Z",
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x2b665036860161c962147A49c5Baf87CFbFC6c4b": 1
			},
			"asks_updated": "2024-01-12T02:31:45.075442207Z",
			"gpus": {
				"": 0
			},
			"qps": 0.024289055,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 0.36861348,
			"throughput_out": 1.5699861
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64ace5dd227f790586239cf6",
		"name": "togethercomputer/falcon-7b",
		"display_name": "Falcon (7B)",
		"display_type": "language",
		"description": "Causal decoder-only model built by TII and trained on 1,500B tokens of RefinedWeb enhanced with curated corpora.",
		"license": "apache-2.0",
		"link": "https://huggingface.co/tiiuae/falcon-7b",
		"creator_organization": "TII UAE",
		"hardware_label": "A40 48GB",
		"pricing_tier": "featured",
		"access": "open",
		"num_parameters": 7000000000,
		"show_in_playground": true,
		"isFeaturedModel": true,
		"context_length": 2048,
		"config": {
			"stop": [
				"<|endoftext|>"
			],
			"chat_template_name": "default"
		},
		"pricing": {
			"input": 50,
			"output": 50,
			"hourly": 0
		},
		"created_at": "2023-07-11T05:17:17.883Z",
		"update_at": "2023-07-11T05:17:17.883Z",
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0xeA9aAE19f2f4423f83eBF38571Cc6F4BC990174d": 1
			},
			"asks_updated": "2024-01-12T05:02:23.839719719Z",
			"gpus": {
				"": 0
			},
			"qps": 0.025090838,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 0.3904532,
			"throughput_out": 1.3441321
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64b7165fcccc52103e2f07e8",
		"name": "togethercomputer/llama-2-13b-chat",
		"display_name": "LLaMA-2 Chat (13B)",
		"display_type": "chat",
		"description": "Llama 2-chat leverages publicly available instruction datasets and over 1 million human annotations. Available in three sizes: 7B, 13B and 70B parameters",
		"license": "LLaMA license Agreement (Meta)",
		"link": "https://huggingface.co/togethercomputer/llama-2-13b-chat",
		"creator_organization": "Meta",
		"hardware_label": "2X A100 80GB",
		"pricing_tier": "Featured",
		"access": "open",
		"num_parameters": "13015864320",
		"show_in_playground": true,
		"finetuning_supported": true,
		"isFeaturedModel": true,
		"context_length": 4096,
		"config": {
			"prompt_format": "[INST] {prompt} [/INST]",
			"stop": [
				"[/INST]",
				"</s>"
			],
			"chat_template_name": "llama"
		},
		"pricing": {
			"input": 55,
			"output": 55,
			"hourly": 0
		},
		"created_at": "2023-07-18T22:46:55.042Z",
		"update_at": "2023-12-04T05:00:54.436Z",
		"instances": [
			{
				"avzone": "us-east-1a",
				"cluster": "happypiglet"
			}
		],
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0xdE32Dce2e5a826Eb6C6a205a0b0366cCbf6ea811": 1
			},
			"asks_updated": "2024-01-12T01:31:23.038537773Z",
			"gpus": {
				"": 0
			},
			"qps": 0.26666666666666666,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 287.4,
			"throughput_out": 77.86666666666666,
			"stats": [
				{
					"avzone": "us-east-1a",
					"cluster": "happypiglet",
					"capacity": 0.03448275862068966,
					"qps": 0.26666666666666666,
					"throughput_in": 287.4,
					"throughput_out": 77.86666666666666,
					"error_rate": 0,
					"retry_rate": 0
				}
			]
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64b7165fcccc52103e2f07e7",
		"name": "togethercomputer/llama-2-13b",
		"display_name": "LLaMA-2 (13B)",
		"display_type": "language",
		"description": "Language model trained on 2 trillion tokens with double the context length of Llama 1. Available in three sizes: 7B, 13B and 70B parameters",
		"license": "LLaMA license Agreement (Meta)",
		"link": "https://huggingface.co/togethercomputer/llama-2-13b",
		"creator_organization": "Meta",
		"hardware_label": "2X A100 80GB",
		"pricing_tier": "Featured",
		"access": "open",
		"num_parameters": "13015864320",
		"show_in_playground": true,
		"finetuning_supported": true,
		"isFeaturedModel": true,
		"context_length": 4096,
		"config": {
			"chat_template_name": "llama"
		},
		"pricing": {
			"input": 55,
			"output": 55,
			"hourly": 0
		},
		"created_at": "2023-07-18T22:46:55.042Z",
		"update_at": "2023-12-04T05:07:52.318Z",
		"instances": [
			{
				"avzone": "us-central-1a",
				"cluster": "sassyseal"
			}
		],
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x7bF7996272049f1634003953D1866AbCE29883e9": 1
			},
			"asks_updated": "2024-01-12T04:30:24.281579263Z",
			"gpus": {
				"": 0
			},
			"qps": 0,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"stats": [
				{
					"avzone": "us-central-1a",
					"cluster": "sassyseal",
					"capacity": 0.057971014492753624,
					"qps": 0,
					"throughput_in": 0,
					"throughput_out": 0,
					"error_rate": 0,
					"retry_rate": 0
				}
			]
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64b7165fcccc52103e2f07ea",
		"name": "togethercomputer/llama-2-70b-chat",
		"display_name": "LLaMA-2 Chat (70B)",
		"display_type": "chat",
		"description": "Llama 2-chat leverages publicly available instruction datasets and over 1 million human annotations. Available in three sizes: 7B, 13B and 70B parameters",
		"license": "LLaMA license Agreement (Meta)",
		"link": "https://huggingface.co/togethercomputer/llama-2-70b-chat",
		"creator_organization": "Meta",
		"hardware_label": "2X A100 80GB",
		"pricing_tier": "Featured",
		"access": "open",
		"num_parameters": "68976648192",
		"show_in_playground": true,
		"finetuning_supported": true,
		"isFeaturedModel": true,
		"context_length": 4096,
		"config": {
			"prompt_format": "[INST] {prompt} [/INST]",
			"stop": [
				"[/INST]",
				"</s>"
			],
			"chat_template_name": "llama"
		},
		"pricing": {
			"input": 225,
			"output": 225,
			"hourly": 0
		},
		"created_at": "2023-07-18T22:46:55.042Z",
		"update_at": "2023-07-18T22:46:55.042Z",
		"autopilot_pool": "cr-a100-80-2x",
		"instances": [
			{
				"avzone": "us-east-1a",
				"cluster": "happypiglet"
			}
		],
		"descriptionLink": "",
		"depth": {
			"num_asks": 2,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x954cD8f6eb6F1400F7752F9a7c5D20dD871B54Ad": 1,
				"0xD9D9CEceE6A83A9656eCdcd87d8e7110502b680f": 1
			},
			"asks_updated": "2024-01-12T05:19:47.208082206Z",
			"gpus": {
				"": 0
			},
			"qps": 0.7333333333333333,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 243.13333333333333,
			"throughput_out": 118.86666666666666,
			"stats": [
				{
					"avzone": "us-east-1a",
					"cluster": "happypiglet",
					"capacity": 0.18015625,
					"qps": 0.7333333333333333,
					"throughput_in": 243.13333333333333,
					"throughput_out": 118.86666666666666,
					"error_rate": 0,
					"retry_rate": 0
				}
			]
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64b7165fcccc52103e2f07e9",
		"name": "togethercomputer/llama-2-70b",
		"display_name": "LLaMA-2 (70B)",
		"display_type": "language",
		"description": "Language model trained on 2 trillion tokens with double the context length of Llama 1. Available in three sizes: 7B, 13B and 70B parameters",
		"license": "LLaMA license Agreement (Meta)",
		"link": "https://huggingface.co/togethercomputer/llama-2-70b",
		"creator_organization": "Meta",
		"hardware_label": "2X A100 80GB",
		"pricing_tier": "Featured",
		"access": "open",
		"num_parameters": "68976648192",
		"show_in_playground": true,
		"finetuning_supported": true,
		"isFeaturedModel": true,
		"context_length": 4096,
		"config": {
			"chat_template_name": "llama"
		},
		"pricing": {
			"input": 225,
			"output": 225,
			"hourly": 0
		},
		"created_at": "2023-07-18T22:46:55.042Z",
		"update_at": "2023-07-18T22:46:55.042Z",
		"autopilot_pool": "cr-a100-80-2x",
		"instances": [
			{
				"avzone": "us-east-1a",
				"cluster": "happypiglet"
			}
		],
		"descriptionLink": "",
		"depth": {
			"num_asks": 2,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x1cA2836F7D6522694c8f20efecAc392A27b06B5F": 1,
				"0x4ed2303cE721121Ce17b0Ad925a54AFF6346dd22": 1
			},
			"asks_updated": "2024-01-12T03:18:25.125089394Z",
			"gpus": {
				"": 0
			},
			"qps": 0,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"stats": [
				{
					"avzone": "us-east-1a",
					"cluster": "happypiglet",
					"capacity": 0.021551724137931036,
					"qps": 0,
					"throughput_in": 0,
					"throughput_out": 0,
					"error_rate": 0,
					"retry_rate": 0
				}
			]
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64b7165fcccc52103e2f07e6",
		"name": "togethercomputer/llama-2-7b-chat",
		"display_name": "LLaMA-2 Chat (7B)",
		"display_type": "chat",
		"description": "Llama 2-chat leverages publicly available instruction datasets and over 1 million human annotations. Available in three sizes: 7B, 13B and 70B parameters",
		"license": "LLaMA license Agreement (Meta)",
		"link": "https://huggingface.co/togethercomputer/llama-2-7b-chat",
		"creator_organization": "Meta",
		"hardware_label": "A100 80GB",
		"pricing_tier": "Featured",
		"access": "open",
		"num_parameters": "6738415616",
		"show_in_playground": true,
		"finetuning_supported": true,
		"isFeaturedModel": true,
		"context_length": 4096,
		"config": {
			"prompt_format": "[INST] {prompt} [/INST]",
			"stop": [
				"[/INST]",
				"</s>"
			],
			"chat_template_name": "llama"
		},
		"pricing": {
			"input": 50,
			"output": 50,
			"hourly": 0
		},
		"created_at": "2023-07-18T22:46:55.042Z",
		"update_at": "2023-07-18T22:46:55.042Z",
		"instances": [
			{
				"avzone": "us-central-1a",
				"cluster": "sassyseal"
			}
		],
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0xcbF16bFD6463b9BE83835E5Aff93dd70bC08e29f": 1
			},
			"asks_updated": "2024-01-12T05:04:45.484024052Z",
			"gpus": {
				"": 0
			},
			"qps": 0.26666666666666666,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 83.13333333333334,
			"throughput_out": 24.333333333333332,
			"stats": [
				{
					"avzone": "us-central-1a",
					"cluster": "sassyseal",
					"capacity": 0.06597222222222222,
					"qps": 0.26666666666666666,
					"throughput_in": 83.13333333333334,
					"throughput_out": 24.333333333333332,
					"error_rate": 0,
					"retry_rate": 0
				}
			]
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64b7165fcccc52103e2f07e5",
		"name": "togethercomputer/llama-2-7b",
		"display_name": "LLaMA-2 (7B)",
		"display_type": "language",
		"description": "Language model trained on 2 trillion tokens with double the context length of Llama 1. Available in three sizes: 7B, 13B and 70B parameters",
		"license": "LLaMA license Agreement (Meta)",
		"link": "https://huggingface.co/togethercomputer/llama-2-7b",
		"creator_organization": "Meta",
		"hardware_label": "A100 80GB",
		"pricing_tier": "Featured",
		"access": "open",
		"num_parameters": "6738415616",
		"show_in_playground": true,
		"finetuning_supported": true,
		"isFeaturedModel": true,
		"context_length": 4096,
		"config": {
			"chat_template_name": "llama"
		},
		"pricing": {
			"input": 50,
			"output": 50,
			"hourly": 0
		},
		"created_at": "2023-07-18T22:46:55.042Z",
		"update_at": "2023-07-18T22:46:55.042Z",
		"instances": [
			{
				"avzone": "us-central-1a",
				"cluster": "sassyseal"
			}
		],
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x4cABD4579EF006b34C5D1EAF8f8e94C6aCb1cCEC": 1
			},
			"asks_updated": "2024-01-12T05:16:56.265446455Z",
			"gpus": {
				"": 0
			},
			"qps": 0,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"stats": [
				{
					"avzone": "us-central-1a",
					"cluster": "sassyseal",
					"capacity": 0.0625,
					"qps": 0,
					"throughput_in": 0,
					"throughput_out": 0,
					"error_rate": 0,
					"retry_rate": 0
				}
			]
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64ee72a0aa4f1b1b2c66f0a5",
		"name": "upstage/SOLAR-0-70b-16bit",
		"display_name": "SOLAR v0 (70B)",
		"display_type": "chat",
		"description": "Language model instruction fine-tuned by upstage.ai on Orca and Alpaca style datasets that reached the top spot in openLLM rankings",
		"license": "CC BY-NC-4.0",
		"creator_organization": "Upstage",
		"hardware_label": "2x A100 80GB",
		"num_parameters": 70000000000,
		"release_date": "2023-08-01T00:00:00.000Z",
		"show_in_playground": true,
		"isFeaturedModel": true,
		"context_length": 4096,
		"config": {
			"stop": [
				"###"
			],
			"prompt_format": "### System:\nYou are a respectful and helpful assistant.\n### User:\n{prompt}\n### Assistant:",
			"chat_template": "{{ '### System:\nYou are a respectful and helpful assistant.\n' }}{% for message in messages %}{% if message['role'] == 'user' %}{{ '### User:\n' + message['content'] + '\n' }}{% else %}{{ '### Assistant:\n' + message['content'] + '\n' }}{% endif %}{% endfor %}{{ '### Assistant:' }}"
		},
		"pricing": {
			"input": 225,
			"output": 225,
			"hourly": 0
		},
		"created_at": "2023-08-29T22:35:12.294Z",
		"update_at": "2023-08-29T22:35:12.294Z",
		"instances": [
			{
				"avzone": "us-central-1a",
				"cluster": "sassyseal"
			}
		],
		"access": "",
		"link": "",
		"descriptionLink": "",
		"depth": {
			"num_asks": 4,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x27aF4Aa79cAF4474BFAE3bdE9D270d5aA66d653e": 1,
				"0x28c6482fc89503c6b1e31df21af94804e82609D5": 1,
				"0x4490a9356Bdd49156142e78388ed80114a4Bc1E6": 1,
				"0x8E3ed25250B5152Ac86935386cdC0F2228EBEC9C": 1
			},
			"asks_updated": "2024-01-12T04:51:55.521627383Z",
			"gpus": {
				"": 0
			},
			"qps": 0,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"stats": [
				{
					"avzone": "us-central-1a",
					"cluster": "sassyseal",
					"capacity": 0,
					"qps": 0,
					"throughput_in": 0,
					"throughput_out": 0,
					"error_rate": 0,
					"retry_rate": 0
				}
			]
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64ace3af227f790586239ce6",
		"name": "wavymulder/Analog-Diffusion",
		"display_name": "Analog Diffusion",
		"display_type": "image",
		"description": "Dreambooth model trained on a diverse set of analog photographs to provide an analog film effect. ",
		"license": "creativeml-openrail-m",
		"link": "https://huggingface.co/wavymulder/Analog-Diffusion",
		"creator_organization": "Wavymulder",
		"hardware_label": "A40 48GB",
		"pricing_tier": "supported",
		"access": "open",
		"num_parameters": 0,
		"show_in_playground": true,
		"isFeaturedModel": true,
		"external_pricing_url": "https://www.together.xyz/apis#pricing",
		"created_at": "2023-07-11T05:07:59.364Z",
		"update_at": "2023-07-11T05:07:59.364Z",
		"descriptionLink": "",
		"pricing": {
			"hourly": 0,
			"input": 0,
			"output": 0,
			"base": 0,
			"finetune": 0
		},
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0xC830b3583bcA51887185318c0184fbdB622A55f5": 1
			},
			"asks_updated": "2024-01-12T04:23:21.207914716Z",
			"gpus": {
				"NVIDIA A40": 1
			},
			"options": {
				"input=text,image": 1
			},
			"qps": 0.013095589,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 0.2652213
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "656a79054d805f78df5fd530",
		"name": "zero-one-ai/Yi-34B-Chat",
		"display_name": "01-ai Yi Chat (34B)",
		"display_type": "chat",
		"description": "The Yi series models are large language models trained from scratch by developers at 01.AI",
		"license": "yi-license",
		"creator_organization": "01.AI",
		"hardware_label": "A100",
		"pricing_tier": "Featured",
		"num_parameters": 34000000000,
		"release_date": "2023-11-01T00:00:00.000Z",
		"show_in_playground": true,
		"isFeaturedModel": true,
		"config": {
			"stop": [
				"<|im_start|>",
				"<|im_end|>"
			],
			"prompt_format": "<|im_start|>user\n{prompt}<|im_end|>\n<|im_start|>assistant\n",
			"pre_prompt": ""
		},
		"pricing": {
			"input": 200,
			"output": 200,
			"base": 0
		},
		"created_at": "2023-12-02T00:23:33.685Z",
		"update_at": "2023-12-02T00:26:55.827Z",
		"instances": [
			{
				"avzone": "us-east-2a",
				"cluster": "jumpyjackal"
			}
		],
		"access": "",
		"link": "",
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x48D9a0565325be1964b5bf8C73033e7b3D10216d": 1
			},
			"asks_updated": "2024-01-12T06:53:35.079079916Z",
			"gpus": {
				"": 0
			},
			"qps": 0.06666666666666667,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 0.4666666666666667,
			"throughput_out": 0.4666666666666667,
			"stats": [
				{
					"avzone": "us-east-2a",
					"cluster": "jumpyjackal",
					"capacity": 0.02150537634408602,
					"qps": 0.06666666666666667,
					"throughput_in": 0.4666666666666667,
					"throughput_out": 0.4666666666666667,
					"error_rate": 0,
					"retry_rate": 0
				}
			]
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "656fa3548d9fd20968de9ba7",
		"name": "zero-one-ai/Yi-34B",
		"display_name": "01-ai Yi Base (34B)",
		"display_type": "language",
		"description": "The Yi series models are large language models trained from scratch by developers at 01.AI",
		"license": "yi-license",
		"creator_organization": "01.AI",
		"hardware_label": "A100",
		"pricing_tier": "Featured",
		"num_parameters": 34000000000,
		"release_date": "2023-11-01T00:00:00.000Z",
		"show_in_playground": true,
		"isFeaturedModel": true,
		"pricing": {
			"input": 200,
			"output": 200
		},
		"created_at": "2023-12-05T22:25:24.982Z",
		"update_at": "2023-12-05T22:51:15.306Z",
		"instances": [
			{
				"avzone": "us-east-2a",
				"cluster": "jumpyjackal"
			}
		],
		"access": "",
		"link": "",
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x3Ce7f858b7dDDAC43F8dfA79fE25fF906696c691": 1
			},
			"asks_updated": "2024-01-12T02:45:31.880988931Z",
			"gpus": {
				"": 0
			},
			"qps": 0,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"stats": [
				{
					"avzone": "us-east-2a",
					"cluster": "jumpyjackal",
					"capacity": 0.015873015873015872,
					"qps": 0,
					"throughput_in": 0,
					"throughput_out": 0,
					"error_rate": 0,
					"retry_rate": 0
				}
			]
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "6570718281b9e1cf0455ec53",
		"name": "zero-one-ai/Yi-6B",
		"display_name": "01-ai Yi Base (6B)",
		"display_type": "language",
		"description": "The Yi series models are large language models trained from scratch by developers at 01.AI",
		"license": "yi-license",
		"creator_organization": "01.AI",
		"hardware_label": "A100",
		"pricing_tier": "Featured",
		"num_parameters": 6000000000,
		"release_date": "2023-11-01T00:00:00.000Z",
		"show_in_playground": true,
		"isFeaturedModel": true,
		"pricing": {
			"input": 20,
			"output": 50
		},
		"created_at": "2023-12-06T13:05:06.567Z",
		"update_at": "2023-12-06T13:07:50.190Z",
		"instances": [
			{
				"avzone": "us-east-2a",
				"cluster": "jumpyjackal"
			}
		],
		"access": "",
		"link": "",
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0xF1a1323A6755bcF13CD869c5aE78B8AD3aC58F43": 1
			},
			"asks_updated": "2024-01-12T06:53:38.165595212Z",
			"gpus": {
				"": 0
			},
			"qps": 0,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"stats": [
				{
					"avzone": "us-east-2a",
					"cluster": "jumpyjackal",
					"capacity": 0.0078125,
					"qps": 0,
					"throughput_in": 0,
					"throughput_out": 0,
					"error_rate": 0,
					"retry_rate": 0
				}
			]
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "6577bf1034e6c1e2bb5283d9",
		"name": "mistralai/Mixtral-8x7B-v0.1",
		"display_name": "Mixtral-8x7B",
		"display_type": "language",
		"description": "The Mixtral-8x7B Large Language Model (LLM) is a pretrained generative Sparse Mixture of Experts.",
		"license": "apache-2.0",
		"link": "https://huggingface.co/mistralai/Mixtral-8x7B-v0.1",
		"creator_organization": "mistralai",
		"pricing_tier": "Featured",
		"access": "open",
		"num_parameters": "56000000000",
		"show_in_playground": true,
		"isFeaturedModel": true,
		"context_length": 32768,
		"pricing": {
			"input": 150,
			"output": 150,
			"hourly": 0
		},
		"created_at": "2023-12-12T02:01:52.674Z",
		"update_at": "2023-12-12T02:01:52.674Z",
		"instances": [
			{
				"avzone": "us-east-1a",
				"cluster": "happypiglet"
			}
		],
		"renamed": "mistralai/mixtral-8x7b-32kseqlen",
		"hardware_label": "",
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"qps": 0,
			"throughput_in": 0,
			"throughput_out": 0,
			"error_rate": 0,
			"retry_rate": 0,
			"stats": [
				{
					"avzone": "us-east-1a",
					"cluster": "happypiglet",
					"capacity": 0,
					"qps": 0,
					"throughput_in": 0,
					"throughput_out": 0,
					"error_rate": 0,
					"retry_rate": 0
				}
			]
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "657bed666aca120ac2af2fb7",
		"name": "HuggingFaceH4/zephyr-7b-beta",
		"display_name": "Zephyr-7B-ß",
		"display_type": "chat",
		"description": "A fine-tuned version of Mistral-7B to act as a helpful assistant.",
		"license": "mit",
		"link": "https://huggingface.co/HuggingFaceH4/zephyr-7b-beta",
		"creator_organization": "HuggingFace",
		"hardware_label": "2x A100 80GB",
		"pricing_tier": "Featured",
		"access": "open",
		"num_parameters": 7241732096,
		"show_in_playground": true,
		"finetuning_supported": true,
		"isFeaturedModel": false,
		"context_length": 32768,
		"config": {
			"stop": [
				"[INST]",
				"</s>"
			],
			"prompt_format": "<s>[INST] {prompt} [INST]"
		},
		"created_at": "2023-12-15T06:08:38.925Z",
		"update_at": "2023-12-15T06:08:38.925Z",
		"instances": [
			{
				"avzone": "us-east-2a",
				"cluster": "jumpyjackal"
			}
		],
		"descriptionLink": "",
		"pricing": {
			"hourly": 0,
			"input": 0,
			"output": 0,
			"base": 0,
			"finetune": 0
		},
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"qps": 0,
			"throughput_in": 0,
			"throughput_out": 0,
			"error_rate": 0,
			"retry_rate": 0,
			"stats": [
				{
					"avzone": "us-east-2a",
					"cluster": "jumpyjackal",
					"capacity": 0,
					"qps": 0,
					"throughput_in": 0,
					"throughput_out": 0,
					"error_rate": 0,
					"retry_rate": 0
				}
			]
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "6495ff1112907e072b8aecbe",
		"name": "EleutherAI/pythia-1b-v0",
		"display_name": "Pythia (1B)",
		"display_type": "language",
		"description": "The Pythia Scaling Suite is a collection of models developed to facilitate interpretability research.",
		"license": "",
		"link": "",
		"creator_organization": "EleutherAI",
		"hardware_label": "A40 48GB",
		"pricing_tier": "supported",
		"num_parameters": 1000000000,
		"show_in_playground": true,
		"isFeaturedModel": false,
		"context_length": 2048,
		"config": {
			"chat_template_name": "gpt"
		},
		"pricing": {
			"input": 25,
			"output": 25,
			"hourly": 0
		},
		"created_at": "2023-06-23T20:22:41.925Z",
		"update_at": "2023-06-23T20:22:41.925Z",
		"access": "",
		"descriptionLink": ""
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "6495ff1412907e072b8aecf1",
		"name": "togethercomputer/codegen2-16B",
		"display_name": "CodeGen2 (16B)",
		"display_type": "code",
		"description": "An autoregressive language models for program synthesis.",
		"license": "",
		"link": "",
		"creator_organization": "Salesforce",
		"hardware_label": "A40 48GB",
		"pricing_tier": "supported",
		"access": "open",
		"num_parameters": 16000000000,
		"release_date": "2022-03-25T00:00:00.000Z",
		"show_in_playground": true,
		"isFeaturedModel": false,
		"context_length": 2048,
		"config": {
			"stop": [
				"\n\n"
			],
			"chat_template_name": "gpt"
		},
		"pricing": {
			"input": 75,
			"output": 75,
			"hourly": 0
		},
		"created_at": "2023-06-23T20:22:44.453Z",
		"update_at": "2023-06-23T20:22:44.453Z",
		"descriptionLink": ""
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "649e1ccca073332e47742415",
		"name": "togethercomputer/replit-code-v1-3b",
		"display_name": "Replit-Code-v1 (3B)",
		"display_type": "code",
		"description": "replit-code-v1-3b is a 2.7B Causal Language Model focused on Code Completion. The model has been trained on a subset of the Stack Dedup v1.2 dataset.",
		"license": "",
		"link": "",
		"creator_organization": "Replit",
		"hardware_label": "A40 48GB",
		"pricing_tier": "featured",
		"access": "limited",
		"num_parameters": 3000000000,
		"release_date": "2023-04-26T00:00:00.000Z",
		"show_in_playground": "true",
		"isFeaturedModel": false,
		"pricing": {
			"input": 25,
			"output": 25,
			"hourly": 0
		},
		"created_at": "2023-06-30T00:07:40.594Z",
		"update_at": "2023-07-07T20:09:09.965Z",
		"descriptionLink": ""
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64aceada227f790586239d11",
		"name": "togethercomputer/mpt-7b",
		"display_name": "MPT (7B)",
		"display_type": "language",
		"description": "Decoder-style transformer pretrained from scratch on 1T tokens of English text and code.",
		"license": "",
		"link": "",
		"creator_organization": "Mosaic ML",
		"hardware_label": "A40 48GB",
		"pricing_tier": "supported",
		"access": "open",
		"num_parameters": 7000000000,
		"show_in_playground": true,
		"isFeaturedModel": false,
		"config": {
			"stop": [
				"<|endoftext|>"
			],
			"chat_template_name": "default",
			"add_generation_prompt": true
		},
		"pricing": {
			"input": 50,
			"output": 50,
			"hourly": 0
		},
		"created_at": "2023-07-11T05:38:34.852Z",
		"update_at": "2023-07-15T03:06:20.780Z",
		"descriptionLink": ""
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64aceb0e227f790586239d12",
		"name": "togethercomputer/mpt-30b-chat",
		"display_name": "MPT-Chat (30B)",
		"display_type": "chat",
		"description": "Chat model for dialogue generation finetuned on ShareGPT-Vicuna, Camel-AI, GPTeacher, Guanaco, Baize and some generated datasets.",
		"license": "",
		"link": "",
		"creator_organization": "Mosaic ML",
		"hardware_label": "A100 80GB",
		"pricing_tier": "supported",
		"access": "open",
		"num_parameters": 30000000000,
		"show_in_playground": true,
		"isFeaturedModel": false,
		"context_length": 2048,
		"config": {
			"stop": [
				"<|im_end|>"
			],
			"prompt_format": "<|im_start|>user\n{prompt}<|im_end|>\n<|im_start|>assistant",
			"chat_template_name": "default",
			"add_generation_prompt": true
		},
		"pricing": {
			"input": 200,
			"output": 200,
			"hourly": 0
		},
		"created_at": "2023-07-11T05:39:26.078Z",
		"update_at": "2023-07-11T05:39:26.078Z",
		"descriptionLink": ""
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "6495ff1212907e072b8aecc5",
		"name": "google/flan-t5-xxl",
		"display_name": "Flan T5 XXL (11B)",
		"display_type": "language",
		"description": "Flan T5 XXL (11B parameters) is T5 fine-tuned on 1.8K tasks ([paper](https://arxiv.org/pdf/2210.11416.pdf)).",
		"creator_organization": "Google",
		"hardware_label": "A40 48GB",
		"access": "open",
		"show_in_playground": true,
		"isFeaturedModel": false,
		"config": {
			"chat_template_name": "default"
		},
		"pricing": {
			"input": 25,
			"output": 25,
			"hourly": 0
		},
		"created_at": "2023-06-23T20:22:42.261Z",
		"update_at": "2023-09-01T14:35:00.161Z",
		"license": "",
		"link": "",
		"descriptionLink": ""
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64ace6df227f790586239cfc",
		"name": "google/flan-t5-xl",
		"display_name": "Flan T5 XL (3B)",
		"display_type": "language",
		"description": "T5 fine-tuned on more than 1000 additional tasks covering also more languages, making it better than T5 at majority of tasks. ",
		"license": "",
		"link": "",
		"creator_organization": "Google",
		"hardware_label": "A40 48GB",
		"pricing_tier": "featured",
		"access": "open",
		"num_parameters": 3000000000,
		"show_in_playground": true,
		"isFeaturedModel": false,
		"config": {
			"chat_template_name": "default"
		},
		"pricing": {
			"input": 25,
			"output": 25,
			"hourly": 0
		},
		"created_at": "2023-06-23T20:22:42.261Z",
		"update_at": "2023-06-23T20:22:42.261Z",
		"descriptionLink": ""
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64aceb6f227f790586239d15",
		"name": "togethercomputer/mpt-7b-instruct",
		"display_name": "MPT-Instruct (7B)",
		"display_type": "language",
		"description": "Designed for short-form instruction following, finetuned on Dolly and Anthropic HH-RLHF and other datasets",
		"license": "",
		"link": "",
		"creator_organization": "Mosaic ML",
		"hardware_label": "A40 48GB",
		"pricing_tier": "supported",
		"access": "open",
		"num_parameters": 7000000000,
		"show_in_playground": true,
		"isFeaturedModel": false,
		"config": {
			"stop": [
				"<|endoftext|>"
			],
			"chat_template_name": "default",
			"add_generation_prompt": true
		},
		"pricing": {
			"input": 50,
			"output": 50,
			"hourly": 0
		},
		"created_at": "2023-07-11T05:41:03.757Z",
		"update_at": "2023-07-11T05:41:03.757Z",
		"descriptionLink": ""
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64acebe0227f790586239d17",
		"name": "NumbersStation/nsql-6B",
		"display_name": "NSQL (6B)",
		"display_type": "language",
		"description": "Foundation model designed specifically for SQL generation tasks. Pre-trained for 3 epochs and fine-tuned for 10 epochs.",
		"license": "",
		"creator_organization": "Numbers Station",
		"hardware_label": "A40 48GB",
		"pricing_tier": "supported",
		"access": "open",
		"num_parameters": 6000000000,
		"show_in_playground": true,
		"isFeaturedModel": false,
		"config": {
			"stop": [
				"<|endoftext|>"
			],
			"chat_template_name": "default"
		},
		"pricing": {
			"input": 50,
			"output": 50,
			"hourly": 0
		},
		"created_at": "2023-07-11T05:42:56.540Z",
		"update_at": "2023-07-11T05:42:56.540Z",
		"link": "",
		"descriptionLink": ""
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64ace9ca227f790586239d09",
		"name": "togethercomputer/Koala-7B",
		"display_name": "Koala (7B)",
		"display_type": "chat",
		"description": "Chatbot trained by fine-tuning LLaMA on dialogue data gathered from the web.",
		"license": "",
		"link": "",
		"creator_organization": "LM Sys",
		"hardware_label": "A40 48GB",
		"pricing_tier": "featured",
		"access": "open",
		"num_parameters": 7000000000,
		"show_in_playground": true,
		"isFeaturedModel": false,
		"config": {
			"stop": [
				"</s>"
			],
			"prompt_format": "USER: {prompt} GPT:",
			"chat_template": "{% for message in messages %}{% if message['role'] == 'user' %}{{ 'USER: ' + message['content'] + ' ' }}{% else %}{{ 'GPT: ' + message['content'] + '\n' }}{% endif %}{% endfor %}{{ 'GPT:' }}"
		},
		"pricing": {
			"input": 50,
			"output": 50,
			"hourly": 0
		},
		"created_at": "2023-07-11T05:34:02.521Z",
		"update_at": "2023-07-11T05:34:02.521Z",
		"descriptionLink": ""
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "6495ff1212907e072b8aecc0",
		"name": "EleutherAI/pythia-6.9b",
		"display_name": "Pythia (6.9B)",
		"display_type": "language",
		"description": "The Pythia Scaling Suite is a collection of models developed to facilitate interpretability research.",
		"license": "",
		"creator_organization": "EleutherAI",
		"hardware_label": "A40 48GB",
		"pricing_tier": "featured",
		"num_parameters": 6900000000,
		"show_in_playground": true,
		"isFeaturedModel": false,
		"context_length": 2048,
		"config": {
			"stop": [
				"<|endoftext|>"
			],
			"chat_template_name": "gpt"
		},
		"pricing": {
			"input": 50,
			"output": 50,
			"hourly": 0
		},
		"created_at": "2023-06-23T20:22:42.044Z",
		"update_at": "2023-06-23T20:22:42.044Z",
		"access": "",
		"link": "",
		"descriptionLink": ""
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "6495ff1112907e072b8aecb8",
		"name": "databricks/dolly-v2-12b",
		"display_name": "Dolly v2 (12B)",
		"display_type": "chat",
		"description": "An instruction-following LLM based on pythia-12b, and trained on ~15k instruction/response fine tuning records generated by Databricks employees.",
		"license": "",
		"link": "",
		"creator_organization": "Databricks",
		"hardware_label": "A40 48GB",
		"pricing_tier": "supported",
		"num_parameters": 12000000000,
		"show_in_playground": true,
		"isFeaturedModel": false,
		"context_length": 2048,
		"config": {
			"stop": [
				"### End"
			],
			"prompt_format": "### Instruction:\n{prompt}\n### Response:",
			"chat_template": "{% for message in messages %}{% if message['role'] == 'user' %}{{ '### Instruction:\n' + message['content'] + '\n' }}{% else %}{{ '### Response:\n' + message['content'] + '\n' }}{% endif %}{% endfor %}{{ '### Response:' }}"
		},
		"pricing": {
			"input": 75,
			"output": 75,
			"hourly": 0
		},
		"created_at": "2023-06-23T20:22:41.607Z",
		"update_at": "2023-06-23T20:22:41.607Z",
		"access": "",
		"descriptionLink": ""
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "6495ff1112907e072b8aecb6",
		"name": "databricks/dolly-v2-3b",
		"display_name": "Dolly v2 (3B)",
		"display_type": "chat",
		"description": "An instruction-following LLM based on pythia-3b, and trained on ~15k instruction/response fine tuning records generated by Databricks employees.",
		"license": "",
		"link": "",
		"creator_organization": "Databricks",
		"hardware_label": "A40 48GB",
		"pricing_tier": "supported",
		"num_parameters": 3000000000,
		"show_in_playground": true,
		"isFeaturedModel": false,
		"context_length": 2048,
		"config": {
			"stop": [
				"### End"
			],
			"prompt_format": "### Instruction:\n{prompt}\n### Response:",
			"chat_template": "{% for message in messages %}{% if message['role'] == 'user' %}{{ '### Instruction:\n' + message['content'] + '\n' }}{% else %}{{ '### Response:\n' + message['content'] + '\n' }}{% endif %}{% endfor %}{{ '### Response:' }}"
		},
		"pricing": {
			"input": 25,
			"output": 25,
			"hourly": 0
		},
		"created_at": "2023-06-23T20:22:41.524Z",
		"update_at": "2023-06-23T20:22:41.524Z",
		"access": "",
		"descriptionLink": ""
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "6495ff1212907e072b8aecc2",
		"name": "EleutherAI/gpt-neox-20b",
		"display_name": "GPT-NeoX (20B)",
		"display_type": "language",
		"description": "Autoregressive language model trained on the Pile. Its architecture intentionally resembles that of GPT-3, and is almost identical to that of GPT-J 6B.",
		"license": "",
		"link": "",
		"creator_organization": "EleutherAI",
		"hardware_label": "A40 48GB",
		"pricing_tier": "supported",
		"num_parameters": 20000000000,
		"show_in_playground": true,
		"isFeaturedModel": false,
		"config": {
			"chat_template_name": "gpt"
		},
		"pricing": {
			"input": 75,
			"output": 75,
			"hourly": 0
		},
		"created_at": "2023-06-23T20:22:42.132Z",
		"update_at": "2023-06-23T20:22:42.132Z",
		"access": "",
		"descriptionLink": ""
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "6495ff1112907e072b8aecbf",
		"name": "EleutherAI/pythia-2.8b-v0",
		"display_name": "Pythia (2.8B)",
		"display_type": "language",
		"description": "The Pythia Scaling Suite is a collection of models developed to facilitate interpretability research.",
		"license": "",
		"creator_organization": "EleutherAI",
		"hardware_label": "A40 48GB",
		"num_parameters": 2800000000,
		"show_in_playground": true,
		"isFeaturedModel": false,
		"context_length": 2048,
		"config": {
			"stop": [
				"<|endoftext|>"
			],
			"chat_template_name": "gpt"
		},
		"pricing": {
			"input": 25,
			"output": 25,
			"hourly": 0
		},
		"created_at": "2023-06-23T20:22:41.975Z",
		"update_at": "2023-06-23T20:22:41.975Z",
		"access": "",
		"link": "",
		"descriptionLink": ""
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64acebb2227f790586239d16",
		"name": "NousResearch/Nous-Hermes-13b",
		"display_name": "Nous Hermes (13B)",
		"display_type": "language",
		"description": "LLaMA 13B fine-tuned on over 300,000 instructions. Designed for long responses, low hallucination rate, and absence of censorship mechanisms.",
		"license": "",
		"link": "",
		"creator_organization": "Nous Research",
		"hardware_label": "A40 48GB",
		"pricing_tier": "supported",
		"access": "open",
		"num_parameters": 13000000000,
		"show_in_playground": true,
		"isFeaturedModel": false,
		"context_length": 2048,
		"config": {
			"chat_template_name": "llama",
			"chat_template": "{% for message in messages %}{% if message['role'] == 'user' %}{{ '### Instruction:\n' + message['content'] + '\n' }}{% else %}{{ '### Response:\n' + message['content'] + '\n' }}{% endif %}{% endfor %}{{ '### Response:\n' }}"
		},
		"pricing": {
			"input": 75,
			"output": 75,
			"hourly": 0
		},
		"created_at": "2023-07-11T05:42:10.444Z",
		"update_at": "2023-07-11T05:42:10.444Z",
		"descriptionLink": ""
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64ace8d1227f790586239d03",
		"name": "togethercomputer/guanaco-65b",
		"display_name": "Guanaco (65B) ",
		"display_type": "chat",
		"description": "Instruction-following language model built on LLaMA. Expanding upon the initial 52K dataset from the Alpaca model, an additional 534,530 focused on multi-lingual tasks.",
		"license": "",
		"link": "",
		"creator_organization": "Tim Dettmers",
		"hardware_label": "2X A100 80GB",
		"pricing_tier": "Supported",
		"access": "open",
		"num_parameters": 65000000000,
		"show_in_playground": true,
		"isFeaturedModel": false,
		"context_length": 2048,
		"config": {
			"stop": [
				"###"
			],
			"prompt_format": "### Human: {prompt} ### Assistant:",
			"chat_template": "{% for message in messages %}{% if message['role'] == 'user' %}{{ '### Human: ' + message['content'] + ' ' }}{% else %}{{ '### Assistant: ' + message['content'] + '\n' }}{% endif %}{% endfor %}{{ '### Assistant:' }}"
		},
		"pricing": {
			"input": 225,
			"output": 225,
			"hourly": 0
		},
		"created_at": "2023-07-11T05:29:53.740Z",
		"update_at": "2023-07-11T05:29:53.740Z",
		"descriptionLink": ""
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64acec99227f790586239d1c",
		"name": "OpenAssistant/oasst-sft-6-llama-30b-xor",
		"display_name": "Open-Assistant LLaMA SFT-6 (30B)",
		"display_type": "chat",
		"description": "Chat-based and open-source assistant. The vision of the project is to make a large language model that can run on a single high-end consumer GPU. ",
		"license": "",
		"link": "",
		"creator_organization": "LAION",
		"hardware_label": "A100 80GB",
		"pricing_tier": "supported",
		"show_in_playground": true,
		"isFeaturedModel": false,
		"config": {
			"stop": [
				"<|endoftext|>"
			],
			"prompt_format": "<|prompter|>{prompt}<|endoftext|><|assistant|>",
			"chat_template": "{% for message in messages %}{% if message['role'] == 'user' %}{{ '<|prompter|>' + message['content'] + '<|endoftext|>' }}{% else %}{{ '<|assistant|>' + message['content'] + '<|endoftext|>\n' }}{% endif %}{% endfor %}{{ '<|assistant|>' }}"
		},
		"pricing": {
			"input": 25,
			"output": 25,
			"hourly": 0
		},
		"created_at": "2023-06-23T20:22:42.469Z",
		"update_at": "2023-06-23T20:22:42.469Z",
		"access": "",
		"descriptionLink": ""
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64ace955227f790586239d06",
		"name": "Salesforce/instructcodet5p-16b",
		"display_name": "InstructCodeT5 (16B)",
		"display_type": "chat",
		"description": "Code large language model that can flexibly operate in different modes to support a wide range of code understanding and generation tasks. ",
		"license": "",
		"link": "",
		"creator_organization": "Salesforce",
		"hardware_label": "A40 48GB",
		"pricing_tier": "supported",
		"access": "open",
		"num_parameters": 33000000000,
		"show_in_playground": true,
		"isFeaturedModel": false,
		"config": {
			"chat_template_name": "default"
		},
		"pricing": {
			"input": 200,
			"output": 200,
			"hourly": 0
		},
		"created_at": "2023-07-11T05:32:05.369Z",
		"update_at": "2023-07-11T05:32:05.369Z",
		"descriptionLink": ""
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64acf031227f790586239d44",
		"name": "lmsys/fastchat-t5-3b-v1.0",
		"display_name": "Vicuna-FastChat-T5 (3B)",
		"display_type": "chat",
		"description": "Chatbot trained by fine-tuning Flan-t5-xl on user-shared conversations collected from ShareGPT.",
		"license": "",
		"link": "",
		"creator_organization": "LM Sys",
		"hardware_label": "A40 48GB",
		"pricing_tier": "featured",
		"num_parameters": 3000000000,
		"show_in_playground": true,
		"isFeaturedModel": false,
		"context_length": 512,
		"config": {
			"stop": [
				"###",
				"</s>"
			],
			"prompt_format": "### Human: {prompt}\n### Assistant:",
			"chat_template": "{% for message in messages %}{% if message['role'] == 'user' %}{{ '### Human: ' + message['content'] + '\n' }}{% else %}{{ '### Assistant: ' + message['content'] + '\n' }}{% endif %}{% endfor %}{{ '### Assistant:' }}"
		},
		"pricing": {
			"input": 25,
			"output": 25,
			"hourly": 0
		},
		"created_at": "2023-07-11T06:01:21.713Z",
		"update_at": "2023-07-11T06:01:21.713Z",
		"access": "",
		"descriptionLink": ""
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64acea6e227f790586239d0e",
		"name": "huggyllama/llama-7b",
		"display_name": "LLaMA (7B)",
		"display_type": "language",
		"description": "An auto-regressive language model, based on the transformer architecture. The model comes in different sizes: 7B, 13B, 33B and 65B parameters.",
		"license": "",
		"link": "",
		"creator_organization": "Meta",
		"hardware_label": "A100 80GB",
		"pricing_tier": "supported",
		"access": "open",
		"num_parameters": 7000000000,
		"show_in_playground": true,
		"isFeaturedModel": false,
		"context_length": 2048,
		"config": {
			"chat_template_name": "llama"
		},
		"pricing": {
			"input": 50,
			"output": 50,
			"hourly": 0
		},
		"created_at": "2023-07-11T05:36:46.255Z",
		"update_at": "2023-07-11T05:36:46.255Z",
		"descriptionLink": ""
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "6495ff1212907e072b8aecc9",
		"name": "OpenAssistant/stablelm-7b-sft-v7-epoch-3",
		"display_name": "Open-Assistant StableLM SFT-7 (7B)",
		"display_type": "chat",
		"description": "Chat-based and open-source assistant. The vision of the project is to make a large language model that can run on a single high-end consumer GPU. ",
		"license": "",
		"link": "",
		"creator_organization": "LAION",
		"hardware_label": "A40 48GB",
		"pricing_tier": "supported",
		"num_parameters": 7000000000,
		"show_in_playground": true,
		"isFeaturedModel": false,
		"context_length": 4096,
		"config": {
			"stop": [
				"<|endoftext|>"
			],
			"prompt_format": "<|prompter|>{prompt}<|endoftext|><|assistant|>",
			"chat_template": "{% for message in messages %}{% if message['role'] == 'user' %}{{ '<|prompter|>' + message['content'] + '<|endoftext|>' }}{% else %}{{ '<|assistant|>' + message['content'] + '<|endoftext|>\n' }}{% endif %}{% endfor %}{{ '<|assistant|>' }}"
		},
		"pricing": {
			"input": 50,
			"output": 50,
			"hourly": 0
		},
		"created_at": "2023-06-23T20:22:42.425Z",
		"update_at": "2023-06-23T20:22:42.425Z",
		"access": "",
		"descriptionLink": ""
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "6495ff1212907e072b8aecc1",
		"name": "EleutherAI/pythia-12b-v0",
		"display_name": "Pythia (12B)",
		"display_type": "language",
		"description": "The Pythia Scaling Suite is a collection of models developed to facilitate interpretability research.",
		"license": "",
		"link": "",
		"creator_organization": "EleutherAI",
		"hardware_label": "A40 48GB",
		"pricing_tier": "supported",
		"num_parameters": 12000000000,
		"show_in_playground": true,
		"isFeaturedModel": false,
		"context_length": 2048,
		"config": {
			"stop": [
				"<|endoftext|>"
			],
			"chat_template_name": "gpt"
		},
		"pricing": {
			"input": 75,
			"output": 75,
			"hourly": 0
		},
		"created_at": "2023-06-23T20:22:42.091Z",
		"update_at": "2023-06-23T20:22:42.091Z",
		"access": "",
		"descriptionLink": ""
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64aceb28227f790586239d13",
		"name": "togethercomputer/mpt-7b-chat",
		"display_name": "MPT-Chat (7B)",
		"display_type": "chat",
		"description": "Chat model for dialogue generation finetuned on ShareGPT-Vicuna, Camel-AI, GPTeacher, Guanaco, Baize and some generated datasets.",
		"license": "",
		"link": "",
		"creator_organization": "Mosaic ML",
		"hardware_label": "A40 48GB",
		"pricing_tier": "supported",
		"access": "open",
		"num_parameters": 7000000000,
		"show_in_playground": true,
		"isFeaturedModel": false,
		"context_length": 2048,
		"config": {
			"stop": [
				"<|im_end|>"
			],
			"prompt_format": "<|im_start|>user\n{prompt}<|im_end|>\n<|im_start|>assistant",
			"chat_template_name": "default",
			"add_generation_prompt": true
		},
		"pricing": {
			"input": 50,
			"output": 50,
			"hourly": 0
		},
		"created_at": "2023-07-11T05:39:52.024Z",
		"update_at": "2023-07-11T05:39:52.024Z",
		"descriptionLink": ""
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "6495ff1212907e072b8aecc8",
		"name": "OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5",
		"display_name": "Open-Assistant Pythia SFT-4 (12B)",
		"display_type": "chat",
		"description": "Chat-based and open-source assistant. The vision of the project is to make a large language model that can run on a single high-end consumer GPU. ",
		"license": "",
		"link": "",
		"creator_organization": "LAION",
		"hardware_label": "A40 48GB",
		"pricing_tier": "supported",
		"num_parameters": 12000000000,
		"show_in_playground": true,
		"isFeaturedModel": false,
		"context_length": 2048,
		"config": {
			"stop": [
				"<|endoftext|>"
			],
			"prompt_format": "<|prompter|>{prompt}<|endoftext|><|assistant|>",
			"chat_template": "{% for message in messages %}{% if message['role'] == 'user' %}{{ '<|prompter|>' + message['content'] + '<|endoftext|>' }}{% else %}{{ '<|assistant|>' + message['content'] + '<|endoftext|>\n' }}{% endif %}{% endfor %}{{ '<|assistant|>' }}"
		},
		"pricing": {
			"input": 75,
			"output": 75,
			"hourly": 0
		},
		"created_at": "2023-06-23T20:22:42.383Z",
		"update_at": "2023-06-23T20:22:42.383Z",
		"access": "",
		"descriptionLink": ""
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "6495ff1112907e072b8aecbc",
		"name": "EleutherAI/gpt-j-6b",
		"display_name": "GPT-J (6B)",
		"display_type": "language",
		"description": "Transformer model trained using Ben Wang's Mesh Transformer JAX. ",
		"license": "",
		"link": "",
		"creator_organization": "EleutherAI",
		"hardware_label": "A40 48GB",
		"pricing_tier": "supported",
		"access": "open",
		"num_parameters": 6000000000,
		"release_date": "2021-06-04T00:00:00.000Z",
		"show_in_playground": true,
		"isFeaturedModel": false,
		"config": {
			"chat_template_name": "gpt"
		},
		"pricing": {
			"input": 50,
			"output": 50,
			"hourly": 0
		},
		"created_at": "2023-06-23T20:22:41.831Z",
		"update_at": "2023-06-23T20:22:41.831Z",
		"descriptionLink": ""
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64acf013227f790586239d43",
		"name": "lmsys/vicuna-7b-v1.3",
		"display_name": "Vicuna v1.3 (7B)",
		"display_type": "chat",
		"description": "Chatbot trained by fine-tuning LLaMA on user-shared conversations collected from ShareGPT. Auto-regressive model, based on the transformer architecture.",
		"license": "",
		"link": "",
		"creator_organization": "LM Sys",
		"hardware_label": "A40 48GB",
		"pricing_tier": "supported",
		"access": "open",
		"num_parameters": 7000000000,
		"show_in_playground": true,
		"isFeaturedModel": false,
		"context_length": 2048,
		"config": {
			"stop": [
				"</s>"
			],
			"prompt_format": "USER: {prompt}\nASSISTANT:",
			"chat_template": "{% for message in messages %}{{message['role'].toLocaleUpperCase() + ': ' + message['content'] + '\n'}}{% endfor %}{{ 'ASSISTANT:' }}"
		},
		"pricing": {
			"input": 50,
			"output": 50,
			"hourly": 0
		},
		"created_at": "2023-07-11T06:00:51.553Z",
		"update_at": "2023-07-11T06:00:51.553Z",
		"descriptionLink": ""
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64ace476227f790586239cef",
		"name": "togethercomputer/codegen2-7B",
		"display_name": "CodeGen2 (7B)",
		"display_type": "code",
		"description": "An autoregressive language models for program synthesis.",
		"license": "",
		"link": "",
		"creator_organization": "Salesforce",
		"hardware_label": "A40 48GB",
		"pricing_tier": "supported",
		"access": "open",
		"num_parameters": 7000000000,
		"release_date": "2022-03-25T00:00:00.000Z",
		"show_in_playground": true,
		"isFeaturedModel": false,
		"context_length": 2048,
		"config": {
			"stop": [
				"\n\n"
			],
			"chat_template_name": "gpt"
		},
		"pricing": {
			"input": 50,
			"output": 50,
			"hourly": 0
		},
		"created_at": "2023-07-11T05:11:18.328Z",
		"update_at": "2023-07-11T05:11:18.328Z",
		"descriptionLink": ""
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64f0de22caa9e2eb543b373b",
		"name": "togethercomputer/guanaco-13b",
		"display_name": "Guanaco (13B) ",
		"display_type": "chat",
		"description": "Instruction-following language model built on LLaMA. Expanding upon the initial 52K dataset from the Alpaca model, an additional 534,530 focused on multi-lingual tasks.",
		"license": "",
		"link": "",
		"creator_organization": "Tim Dettmers",
		"hardware_label": "A40 48GB",
		"pricing_tier": "Supported",
		"access": "open",
		"num_parameters": 13000000000,
		"show_in_playground": true,
		"isFeaturedModel": false,
		"context_length": 2048,
		"config": {
			"stop": [
				"###"
			],
			"prompt_format": "### Human: {prompt} ### Assistant:",
			"chat_template": "{% for message in messages %}{% if message['role'] == 'user' %}{{ '### Human: ' + message['content'] + ' ' }}{% else %}{{ '### Assistant: ' + message['content'] + '\n' }}{% endif %}{% endfor %}{{ '### Assistant:' }}"
		},
		"pricing": {
			"input": 75,
			"output": 75,
			"hourly": 0
		},
		"created_at": "2023-07-11T05:29:07.717Z",
		"update_at": "2023-07-11T05:29:07.717Z",
		"descriptionLink": ""
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64acefe5227f790586239d41",
		"name": "lmsys/vicuna-13b-v1.3",
		"display_name": "Vicuna v1.3 (13B)",
		"display_type": "chat",
		"description": "Chatbot trained by fine-tuning LLaMA on user-shared conversations collected from ShareGPT. Auto-regressive model, based on the transformer architecture.",
		"license": "",
		"link": "",
		"creator_organization": "LM Sys",
		"hardware_label": "A40 48GB",
		"pricing_tier": "supported",
		"access": "open",
		"num_parameters": 13000000000,
		"show_in_playground": true,
		"isFeaturedModel": false,
		"context_length": 2048,
		"config": {
			"stop": [
				"</s>"
			],
			"prompt_format": "USER: {prompt}\nASSISTANT:",
			"chat_template": "{% for message in messages %}{{message['role'].toLocaleUpperCase() + ': ' + message['content'] + '\n'}}{% endfor %}{{ 'ASSISTANT:' }}"
		},
		"pricing": {
			"input": 75,
			"output": 75,
			"hourly": 0
		},
		"created_at": "2023-07-11T06:00:05.166Z",
		"update_at": "2023-07-15T03:08:44.173Z",
		"descriptionLink": ""
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64acea0b227f790586239d0b",
		"name": "huggyllama/llama-13b",
		"display_name": "LLaMA (13B)",
		"display_type": "language",
		"description": "An auto-regressive language model, based on the transformer architecture. The model comes in different sizes: 7B, 13B, 33B and 65B parameters.",
		"license": "",
		"link": "",
		"creator_organization": "Meta",
		"hardware_label": "A100 80GB",
		"pricing_tier": "supported",
		"access": "open",
		"num_parameters": 13000000000,
		"show_in_playground": true,
		"isFeaturedModel": false,
		"context_length": 2048,
		"config": {
			"chat_template_name": "llama"
		},
		"pricing": {
			"input": 75,
			"output": 75,
			"hourly": 0
		},
		"created_at": "2023-07-11T05:35:07.955Z",
		"update_at": "2023-07-11T05:35:07.955Z",
		"descriptionLink": ""
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64acefbe227f790586239d40",
		"name": "HuggingFaceH4/starchat-alpha",
		"display_name": "StarCoderChat Alpha (16B)",
		"display_type": "chat",
		"description": "Fine-tuned from StarCoder to act as a helpful coding assistant. As an alpha release is only intended for educational or research purpopses.",
		"license": "",
		"link": "",
		"creator_organization": "HuggingFaceH4",
		"hardware_label": "A40 48GB",
		"pricing_tier": "supported",
		"num_parameters": 16000000000,
		"show_in_playground": true,
		"isFeaturedModel": false,
		"context_length": 8192,
		"config": {
			"stop": [
				"<|endoftext|>",
				"<|end|>"
			],
			"prompt_format": "<|system|>\n<|end|>\n<|user|>\n{prompt}<|end|>\n<|assistant|>",
			"chat_template_name": "default"
		},
		"pricing": {
			"input": 75,
			"output": 75,
			"hourly": 0
		},
		"created_at": "2023-07-11T05:59:26.298Z",
		"update_at": "2023-07-11T05:59:26.298Z",
		"access": "",
		"descriptionLink": ""
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64acea35227f790586239d0c",
		"name": "huggyllama/llama-30b",
		"display_name": "LLaMA (30B)",
		"display_type": "language",
		"description": "An auto-regressive language model, based on the transformer architecture. The model comes in different sizes: 7B, 13B, 33B and 65B parameters.",
		"license": "",
		"link": "",
		"creator_organization": "Meta",
		"hardware_label": "A100 80GB",
		"access": "open",
		"num_parameters": 33000000000,
		"show_in_playground": true,
		"isFeaturedModel": false,
		"context_length": 2048,
		"config": {
			"chat_template_name": "llama"
		},
		"pricing": {
			"input": 200,
			"output": 200,
			"hourly": 0
		},
		"created_at": "2023-07-11T05:35:49.870Z",
		"update_at": "2023-07-11T05:35:49.870Z",
		"descriptionLink": ""
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "6495ff1512907e072b8aecf5",
		"name": "stabilityai/stablelm-base-alpha-7b",
		"display_name": "StableLM-Base-Alpha (7B)",
		"display_type": "language",
		"description": "Decoder-only language model pre-trained on a diverse collection of English and Code datasets with a sequence length of 4096.",
		"license": "",
		"link": "",
		"creator_organization": "Stability AI",
		"hardware_label": "A40 48GB",
		"pricing_tier": "supported",
		"num_parameters": 7000000000,
		"show_in_playground": true,
		"isFeaturedModel": false,
		"config": {
			"chat_template_name": "gpt"
		},
		"pricing": {
			"input": 50,
			"output": 50,
			"hourly": 0
		},
		"created_at": "2023-06-23T20:22:45.249Z",
		"update_at": "2023-06-23T20:22:45.249Z",
		"access": "",
		"descriptionLink": ""
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "6495ff1412907e072b8aecf4",
		"name": "stabilityai/stablelm-base-alpha-3b",
		"display_name": "StableLM-Base-Alpha (3B)",
		"display_type": "language",
		"description": "Decoder-only language model pre-trained on a diverse collection of English and Code datasets with a sequence length of 4096.",
		"license": "",
		"link": "",
		"creator_organization": "Stability AI",
		"hardware_label": "A40 48GB",
		"pricing_tier": "supported",
		"num_parameters": 3000000000,
		"show_in_playground": true,
		"isFeaturedModel": false,
		"config": {
			"chat_template_name": "gpt"
		},
		"pricing": {
			"input": 25,
			"output": 25,
			"hourly": 0
		},
		"created_at": "2023-06-23T20:22:44.907Z",
		"update_at": "2023-06-23T20:22:44.907Z",
		"access": "",
		"descriptionLink": ""
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64f67987bc372ce719b97f07",
		"name": "defog/sqlcoder",
		"display_name": "Sqlcoder (15B)",
		"display_type": "language",
		"description": "Defog's SQLCoder is a state-of-the-art LLM for converting natural language questions to SQL queries, fine-tuned from Bigcode's Starcoder 15B model.",
		"license": "",
		"creator_organization": "Defog",
		"hardware_label": "A40 48GB",
		"pricing_tier": "supported",
		"access": "open",
		"num_parameters": 15000000000,
		"show_in_playground": true,
		"isFeaturedModel": false,
		"context_length": 8192,
		"config": {
			"stop": [
				"<|endoftext|>"
			],
			"prompt_format": "### Instructions:\n\n{prompt}\n\n### Response:\n"
		},
		"pricing": {
			"input": 75,
			"output": 75,
			"hourly": 0
		},
		"created_at": "2023-09-05T00:42:47.496Z",
		"update_at": "2023-09-05T00:42:47.496Z",
		"link": "",
		"descriptionLink": ""
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64acef6e227f790586239d3f",
		"name": "bigcode/starcoder",
		"display_name": "StarCoder (16B)",
		"display_type": "code",
		"description": "Trained on 80+ coding languages, uses Multi Query Attention, an 8K context window, and was trained using the Fill-in-the-Middle objective on 1T tokens.",
		"license": "",
		"link": "",
		"creator_organization": "BigCode",
		"hardware_label": "A100 80GB",
		"pricing_tier": "supported",
		"num_parameters": 16000000000,
		"show_in_playground": true,
		"isFeaturedModel": false,
		"context_length": 8192,
		"config": {
			"stop": [
				"<|endoftext|>",
				"<|end|>"
			]
		},
		"pricing": {
			"input": 75,
			"output": 75,
			"hourly": 0
		},
		"created_at": "2023-07-11T05:58:06.486Z",
		"update_at": "2023-07-11T05:58:06.486Z",
		"access": "",
		"descriptionLink": ""
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "6495ff1112907e072b8aecb7",
		"name": "databricks/dolly-v2-7b",
		"display_name": "Dolly v2 (7B)",
		"display_type": "chat",
		"description": "An instruction-following LLM based on pythia-7b, and trained on ~15k instruction/response fine tuning records generated by Databricks employees.",
		"license": "",
		"link": "",
		"creator_organization": "Databricks",
		"hardware_label": "A40 48GB",
		"pricing_tier": "featured",
		"num_parameters": 7000000000,
		"show_in_playground": true,
		"isFeaturedModel": false,
		"context_length": 2048,
		"config": {
			"stop": [
				"### End"
			],
			"prompt_format": "### Instruction:\n{prompt}\n### Response:",
			"chat_template": "{% for message in messages %}{% if message['role'] == 'user' %}{{ '### Instruction:\n' + message['content'] + '\n' }}{% else %}{{ '### Response:\n' + message['content'] + '\n' }}{% endif %}{% endfor %}{{ '### Response:' }}"
		},
		"pricing": {
			"input": 50,
			"output": 50,
			"hourly": 0
		},
		"created_at": "2023-06-23T20:22:41.565Z",
		"update_at": "2023-06-23T20:22:41.565Z",
		"access": "",
		"descriptionLink": ""
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64ace8a3227f790586239d02",
		"name": "togethercomputer/guanaco-33b",
		"display_name": "Guanaco (33B) ",
		"display_type": "chat",
		"description": "Instruction-following language model built on LLaMA. Expanding upon the initial 52K dataset from the Alpaca model, an additional 534,530 focused on multi-lingual tasks.",
		"license": "",
		"link": "",
		"creator_organization": "Tim Dettmers",
		"hardware_label": "A100 80GB",
		"pricing_tier": "Supported",
		"access": "open",
		"num_parameters": 33000000000,
		"show_in_playground": true,
		"isFeaturedModel": false,
		"context_length": 2048,
		"config": {
			"stop": [
				"###"
			],
			"prompt_format": "### Human: {prompt} ### Assistant:",
			"chat_template": "{% for message in messages %}{% if message['role'] == 'user' %}{{ '### Human: ' + message['content'] + ' ' }}{% else %}{{ '### Assistant: ' + message['content'] + '\n' }}{% endif %}{% endfor %}{{ '### Assistant:' }}"
		},
		"pricing": {
			"input": 200,
			"output": 200,
			"hourly": 0
		},
		"created_at": "2023-07-11T05:29:07.717Z",
		"update_at": "2023-07-11T05:29:07.717Z",
		"descriptionLink": ""
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64ace9b1227f790586239d07",
		"name": "togethercomputer/Koala-13B",
		"display_name": "Koala (13B)",
		"display_type": "chat",
		"description": "Chatbot trained by fine-tuning LLaMA on dialogue data gathered from the web.",
		"license": "",
		"link": "",
		"creator_organization": "LM Sys",
		"hardware_label": "A40 48GB",
		"pricing_tier": "supported",
		"access": "open",
		"num_parameters": 13000000000,
		"show_in_playground": true,
		"isFeaturedModel": false,
		"context_length": 2048,
		"config": {
			"stop": [
				"</s>"
			],
			"prompt_format": "USER: {prompt} GPT:",
			"chat_template": "{% for message in messages %}{% if message['role'] == 'user' %}{{ 'USER: ' + message['content'] + ' ' }}{% else %}{{ 'GPT: ' + message['content'] + '\n' }}{% endif %}{% endfor %}{{ 'GPT:' }}"
		},
		"pricing": {
			"input": 75,
			"output": 75,
			"hourly": 0
		},
		"created_at": "2023-07-11T05:33:37.737Z",
		"update_at": "2023-07-11T05:33:37.737Z",
		"descriptionLink": ""
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "64ace8ed227f790586239d04",
		"name": "togethercomputer/guanaco-7b",
		"display_name": "Guanaco (7B) ",
		"display_type": "chat",
		"description": "Instruction-following language model built on LLaMA. Expanding upon the initial 52K dataset from the Alpaca model, an additional 534,530 focused on multi-lingual tasks. ",
		"license": "",
		"link": "",
		"creator_organization": "Tim Dettmers",
		"hardware_label": "A40 48GB",
		"access": "open",
		"num_parameters": 7000000000,
		"show_in_playground": true,
		"isFeaturedModel": false,
		"context_length": 2048,
		"config": {
			"stop": [
				"###"
			],
			"prompt_format": "### Human: {prompt} ### Assistant:",
			"chat_template": "{% for message in messages %}{% if message['role'] == 'user' %}{{ '### Human: ' + message['content'] + ' ' }}{% else %}{{ '### Assistant: ' + message['content'] + '\n' }}{% endif %}{% endfor %}{{ '### Assistant:' }}"
		},
		"pricing": {
			"input": 50,
			"output": 50,
			"hourly": 0
		},
		"created_at": "2023-07-11T05:30:21.531Z",
		"update_at": "2023-07-11T05:30:21.531Z",
		"descriptionLink": ""
	}
];

for (const mod of models.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))) {
	if (mod.display_type !== "chat" && mod.display_type !== "code") {
		continue;
	}
	if (!mod.instances) {
		continue;
	}
	console.log(`{name: "${mod.name}", bold: false},`);
}
