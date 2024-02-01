let models = [
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
				"0x28Ae7c37F200EBAD8C237ea6002056700D1D0DB2": 1,
				"0xa6f750121e302654eA2D4ceC8a3CE30ACf8f0499": 1
			},
			"asks_updated": "2024-01-27T11:01:30.82448601Z",
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
					"avzone": "us-central-5a",
					"cluster": "wrigleycub",
					"capacity": 0.25,
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
				"0x8Cb311340FC6D910140fF403D8f64644f3e05e37": 1
			},
			"asks_updated": "2024-01-27T11:44:04.670339021Z",
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
			"throughput_out": 8.533333333333333,
			"stats": [
				{
					"avzone": "us-east-1a",
					"cluster": "happypiglet",
					"capacity": 0.030303030303030304,
					"qps": 0.06666666666666667,
					"throughput_in": 0.4666666666666667,
					"throughput_out": 8.533333333333333,
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
		"instances": [
			{
				"avzone": "us-central-5a",
				"cluster": "testytiger"
			}
		],
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x7E787EB9044d3b6D9f2907Dee9a392526074cE36": 1
			},
			"asks_updated": "2024-01-27T11:38:52.152415896Z",
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
					"avzone": "us-central-5a",
					"cluster": "testytiger",
					"capacity": 0.125,
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
				"avzone": "us-east-2a",
				"cluster": "jumpyjackal"
			},
			{
				"avzone": "us-central-5a",
				"cluster": "wrigleycub"
			},
			{
				"avzone": "ap-northeast-1a",
				"cluster": "optimisticotter"
			},
			{
				"avzone": "us-central-2a",
				"cluster": "jollyllama"
			}
		],
		"access": "",
		"link": "",
		"descriptionLink": "",
		"depth": {
			"num_asks": 54,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x0026Bed1182260FFb12621A30F1bE3560b37f94a": 1,
				"0x02e3fd28726382Dd7CFA7901F8332abBd9608e72": 1,
				"0x08840a241E355626f42bF8546e5E22385C0fC33E": 1,
				"0x16073c55346E7B5f388db71447fAa206a8dd5CF0": 1,
				"0x1fbCDFDD3BFe598Aa0dfFD8390a143e6224e9e7B": 1,
				"0x232363fA4A952f6e29983EeA22A2E39b2e62973d": 1,
				"0x2927C272a4B7c31Bc2c486eEBc0E5AA86f3CcEfB": 1,
				"0x2b69983bf96c4332d35ceC93cF97417b60ed5519": 1,
				"0x313c7B67CCF26A31463cD2338835511b89BEEB49": 1,
				"0x34211f85cD09c8089712d952C4C0703ba2f16516": 1,
				"0x3c0F66d55D78b2F8Fd8500FfaEa8e16B8E31249E": 1,
				"0x4DB7fe5DAA4D6b3285413A218D4e81FCed2687cc": 1,
				"0x4E2D160C36cA01686D2662499a45020c03110511": 1,
				"0x51cE21328fBfc572FFA0468A7a8AEBf2A9F6EE45": 1,
				"0x545f090bE948b4507080B53eF77e9491a3E9025F": 1,
				"0x56EF47C02F0954906dbcd8D65c7C8a06C58c4419": 1,
				"0x58c3617651aD71D1B23B8576245f87dBCb3Dc763": 1,
				"0x59FF0c2F988B3C8Caea1e29f9fC0163eDC659F5d": 1,
				"0x5b1e5643738c23CbaBe03A9c14eA739761e35377": 1,
				"0x5d7397f120985dfE675F4D7b9c6900e977Eb551D": 1,
				"0x625E8490121D7DB081d8Fa66cFA4cC6D018F704c": 1,
				"0x672ed7D4Ae7C5F60b6E887b88536672252Ee14F9": 1,
				"0x729BA8932D2fC1e526673A1A6F2F0EcAA6fb9838": 1,
				"0x739A4B6fCdba1d99949B30760dA954D71048f625": 1,
				"0x745cee17E9c5f374F6CEE542C254b5DE4fFb5334": 1,
				"0x77b617b3fa0294E651afbc9c51bf632dEbeeFdAc": 1,
				"0x78095EF0524aef7951806a98416C57443d018048": 1,
				"0x807E363FB66192d34CD0Fa9f9A55ABF7f068c309": 1,
				"0x8aF3B8985d835A0e24377c8367e2ad8Eec37A7DA": 1,
				"0x8b65BE0c475018478c4FE25798E03834B8588B3A": 1,
				"0x8e5403C413DE5226A6c0A2250A4ccafF957c4398": 1,
				"0x98fcf78348Aa1DCEbF11232E9d7c9aaD3d8bDb9E": 1,
				"0x9B42dEC0DFb20Ea1fC19365C2e88E8173f442664": 1,
				"0xB005FD1B9A5Ccb8B545700f0E776a51Ad31E2bd2": 1,
				"0xBbCF26bD7da46d84C7c963a9F4c11ba7B4022863": 1,
				"0xC3Cc2c0Fe69270b33bb7Bc6Dba6faB01958874c6": 1,
				"0xC9faCfb16dfBe1064b52cD18FaB73F6159948d41": 1,
				"0xD894Fe61Ebc57d62A4Cf607e39df7079CE06A7ad": 1,
				"0xD90ce2565dAD34FBc059C87A67a0E29676D7f43b": 1,
				"0xE03A304c415f8A872610B9A2d8459AFcA1a1102a": 1,
				"0xE0Fe9Bcc24DcCFFC76d697Af5717505c6967eD07": 1,
				"0xE310c12F2fe6ba16D613c643475BE8453f144908": 1,
				"0xF4DA53ae91f4cc347148C9b9CFee3cEa288bDE63": 1,
				"0xF56A18817e97C899B7F6d5E0A862A786BBF4b69B": 1,
				"0xF91C0798699FF00CC0FA5A58C06a1C742543f88f": 1,
				"0xa9669c717f1Fa1405CEe2E36cd877240D759Cfcb": 1,
				"0xb38cD5cb8f0C610fD72c1AE6a5C55459e6417F3c": 1,
				"0xb4FF4A51d003705aA8123023D0a45755726a3dA5": 1,
				"0xb625A364F7c5ad5C413Ee99fD5BcC552E3a5bE45": 1,
				"0xbb6aC7d85De74b85DfD07cf52d2C3b2068f2814D": 1,
				"0xcc1cBb1A210aA8ba96243D0747cA5Eb760E534e3": 1,
				"0xd2c27EC8435041F6AB28714D42C94E9F232f02eb": 1,
				"0xe991f9163009Cbd793a80cB9E51D8F4811902418": 1,
				"0xf24A7BA151F83b95fF082cB5367898f7c2b09AdE": 1,
				"0xf5508486edAa90e9461eD80d91bd9237e1150192": 1,
				"0xfAafA4dac8a51b70EB992a7E79348a605C88CA06": 1,
				"0xfe94132fa325EC5f970749E9D179e38717209f80": 1
			},
			"asks_updated": "2024-01-28T11:42:13.731417182Z",
			"gpus": {
				"": 0
			},
			"qps": 55.06666666666666,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 44740.8,
			"throughput_out": 7551.2,
			"retry_rate": 0.9333333333333333,
			"stats": [
				{
					"avzone": "us-east-2a",
					"cluster": "jumpyjackal",
					"capacity": 0.48811881188118805,
					"qps": 14.666666666666666,
					"throughput_in": 12063.133333333333,
					"throughput_out": 1834.5333333333333,
					"error_rate": 0,
					"retry_rate": 0
				},
				{
					"avzone": "us-central-5a",
					"cluster": "wrigleycub",
					"capacity": 0.15511811023622038,
					"qps": 13.133333333333333,
					"throughput_in": 11092.8,
					"throughput_out": 1942.2666666666667,
					"error_rate": 0,
					"retry_rate": 0.3333333333333333
				},
				{
					"avzone": "ap-northeast-1a",
					"cluster": "optimisticotter",
					"capacity": 0.5697157622739009,
					"qps": 13,
					"throughput_in": 10396.6,
					"throughput_out": 1788.2,
					"error_rate": 0,
					"retry_rate": 0.26666666666666666
				},
				{
					"avzone": "us-central-2a",
					"cluster": "jollyllama",
					"capacity": 0.250242685947647,
					"qps": 14.266666666666667,
					"throughput_in": 11188.266666666666,
					"throughput_out": 1986.2,
					"error_rate": 0,
					"retry_rate": 0.3333333333333333
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
			"input": 6,
			"output": 6,
			"hourly": 0
		},
		"update_at": "2024-01-18T17:03:16.859Z",
		"instances": [
			{
				"avzone": "ap-northeast-1a",
				"cluster": "optimisticotter"
			}
		],
		"hardware_label": "",
		"descriptionLink": "",
		"depth": {
			"num_asks": 2,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x1Df913A55fB33624b5E9661ED65E94DC5Ea08E6D": 1,
				"0xA232661Ea91ccb7FF243119024F2A5B283b272ff": 1
			},
			"asks_updated": "2024-01-28T07:19:13.76022617Z",
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
			"throughput_in": 81.8,
			"throughput_out": 8.8,
			"stats": [
				{
					"avzone": "ap-northeast-1a",
					"cluster": "optimisticotter",
					"capacity": 0.17635467980295588,
					"qps": 0.2,
					"throughput_in": 81.8,
					"throughput_out": 8.8,
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
				"avzone": "ap-northeast-1a",
				"cluster": "optimisticotter"
			}
		],
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x80DD495D00fEE432d8B60066f93FD20500DF9C93": 1
			},
			"asks_updated": "2024-01-28T08:42:55.788255685Z",
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
					"avzone": "ap-northeast-1a",
					"cluster": "optimisticotter",
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
			"num_asks": 14,
			"num_bids": 10,
			"num_running": 10,
			"asks": {
				"0x0b4Ba87cA9b5FD677574f39a0552B316b10F0Cee": 1,
				"0x3812808EF729628F2A066D8d2096f47865a2F586": 4,
				"0x6837Cd8A797B53B9f92ca92C37169D77C571BAA1": 1,
				"0x6C669109E61B568a1196A7d5A0b0BDD77F8fA664": 1,
				"0x9b5eea36146ceD560DF92679B810e3A691d332dB": 1,
				"0xA3d760FEb1951734e9c24c967C2fcc0Ac47adEC4": 1,
				"0xD7F589C032FE87f70a1c7efCBBAFf4D4bB8e33Be": 2,
				"0xDE188C285C393e238ACDef1d6DBB3557041AD8f3": 1,
				"0xeCecDe213d10a1Fbbe489DA4ba4Bd825C9dE70eD": 1,
				"0xeb8B2072208d0555066Dbd668D32b723daa9bd62": 1
			},
			"asks_updated": "2024-01-28T11:41:26.194878312Z",
			"gpus": {
				"": 0
			},
			"qps": 0.8,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 1525.4666666666667,
			"throughput_out": 117.66666666666667,
			"stats": [
				{
					"avzone": "us-central-1a",
					"cluster": "sassyseal",
					"capacity": 0.4184397163120568,
					"qps": 0.8,
					"throughput_in": 1525.4666666666667,
					"throughput_out": 117.66666666666667,
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
		"_id": "65a4b298fbc8405400423169",
		"name": "NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO",
		"display_name": "Nous Hermes 2 - Mixtral 8x7B-DPO ",
		"display_type": "chat",
		"description": "Nous Hermes 2 Mixtral 7bx8 DPO is the new flagship Nous Research model trained over the Mixtral 7bx8 MoE LLM. The model was trained on over 1,000,000 entries of primarily GPT-4 generated data, as well as other high quality data from open datasets across the AI landscape, achieving state of the art performance on a variety of tasks.",
		"license": "apache-2.0",
		"link": "https://huggingface.co/NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO",
		"creator_organization": "NousResearch",
		"pricing_tier": "Featured",
		"access": "open",
		"num_parameters": "56000000000",
		"show_in_playground": true,
		"isFeaturedModel": true,
		"context_length": 32768,
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
			"input": 150,
			"output": 150,
			"hourly": 0
		},
		"created_at": "2024-01-15T04:20:40.079Z",
		"update_at": "2024-01-15T04:20:40.079Z",
		"instances": [
			{
				"avzone": "us-central-5a",
				"cluster": "wrigleycub"
			}
		],
		"hardware_label": "",
		"descriptionLink": "",
		"depth": {
			"num_asks": 3,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x32b741eFa5c7dEF7f448A1002cF8DcEB1C1149De": 1,
				"0x70563b6C4Bb757519f75460EdA995bD10FA4Caa1": 1,
				"0xbba1A54574E347a8788CAE187dE170674895bB6d": 1
			},
			"asks_updated": "2024-01-27T16:48:38.858022334Z",
			"gpus": {
				"": 0
			},
			"qps": 0.6666666666666666,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 568.8666666666667,
			"throughput_out": 63.333333333333336,
			"stats": [
				{
					"avzone": "us-central-5a",
					"cluster": "wrigleycub",
					"capacity": 0.06628787878787878,
					"qps": 0.6666666666666666,
					"throughput_in": 568.8666666666667,
					"throughput_out": 63.333333333333336,
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
		"_id": "65a4466efbc8405400423166",
		"name": "NousResearch/Nous-Hermes-2-Mixtral-8x7B-SFT",
		"display_name": "Nous Hermes 2 - Mixtral 8x7B-SFT",
		"display_type": "chat",
		"description": "Nous Hermes 2 Mixtral 7bx8 SFT is the new flagship Nous Research model trained over the Mixtral 7bx8 MoE LLM. The model was trained on over 1,000,000 entries of primarily GPT-4 generated data, as well as other high quality data from open datasets across the AI landscape, achieving state of the art performance on a variety of tasks.",
		"license": "apache-2.0",
		"link": "https://huggingface.co/NousResearch/Nous-Hermes-2-Mixtral-8x7B-SFT",
		"creator_organization": "NousResearch",
		"pricing_tier": "Featured",
		"access": "open",
		"num_parameters": "56000000000",
		"show_in_playground": true,
		"isFeaturedModel": true,
		"context_length": 32768,
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
			"input": 150,
			"output": 150,
			"hourly": 0
		},
		"created_at": "2024-01-14T20:39:10.060Z",
		"update_at": "2024-01-14T20:39:10.060Z",
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
				"0x20672bd9B0918a94ece9254cA9659f21e457b65b": 1,
				"0xAe49Cd900CF7DdF1830EcF188c455e0cD658C0EC": 1
			},
			"asks_updated": "2024-01-28T11:16:06.302124148Z",
			"gpus": {
				"": 0
			},
			"qps": 3.1333333333333333,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 3624.3333333333335,
			"throughput_out": 285.26666666666665,
			"stats": [
				{
					"avzone": "us-central-5a",
					"cluster": "wrigleycub",
					"capacity": 0.46111719605695534,
					"qps": 3.1333333333333333,
					"throughput_in": 3624.3333333333335,
					"throughput_out": 285.26666666666665,
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
		"instances": [
			{
				"avzone": "ap-northeast-1a",
				"cluster": "optimisticotter"
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
				"0x90462E9dF5B4D30aF311cF945680b9bF811b8D7f": 1
			},
			"asks_updated": "2024-01-27T17:17:48.248099526Z",
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
			"throughput_in": 0.4,
			"throughput_out": 8.533333333333333,
			"stats": [
				{
					"avzone": "ap-northeast-1a",
					"cluster": "optimisticotter",
					"capacity": 0.018518518518518517,
					"qps": 0.06666666666666667,
					"throughput_in": 0.4,
					"throughput_out": 8.533333333333333,
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
			}
		],
		"link": "",
		"descriptionLink": "",
		"depth": {
			"num_asks": 4,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x7D5B340D56c131104a0f7Bb698CFC9f342710c49": 1,
				"0x9C1f53616ac2775A4C9faB53d1ee4e01F506Ab7d": 1,
				"0xE521C2c2030b68E8352654F888648A54Ab9f9774": 1,
				"0xb8dA7dfEbdc552588a25fE10e7F1C2A879967A9f": 1
			},
			"asks_updated": "2024-01-28T03:09:36.097909339Z",
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
			"throughput_in": 1526.2,
			"throughput_out": 89.6,
			"stats": [
				{
					"avzone": "us-central-1a",
					"cluster": "sassyseal",
					"capacity": 0.11515151515151506,
					"qps": 1.1333333333333333,
					"throughput_in": 1526.2,
					"throughput_out": 89.6,
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
			"asks_updated": "2024-01-28T04:30:51.977920209Z",
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
			"asks_updated": "2024-01-27T10:15:52.209524402Z",
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
		"_id": "65ac4e5e75846d9d3ae5b836",
		"name": "NumbersStation/nsql-llama-2-7B",
		"display_name": "NSQL LLaMA-2 (7B)",
		"description": "NSQL is a family of autoregressive open-source large foundation models (FMs) designed specifically for SQL generation tasks",
		"link": "https://huggingface.co/NumbersStation/nsql-llama-2-7B",
		"creator_organization": "Numbers Station",
		"hardware_label": "A100",
		"pricing_tier": "Featured",
		"num_parameters": 7000000000,
		"release_date": "2024-01-20T22:51:10.492Z",
		"show_in_playground": true,
		"isFeaturedModel": true,
		"pricing": {
			"hourly": 0,
			"input": 50,
			"output": 50,
			"finetune": 0,
			"base": 0
		},
		"created_at": "2024-01-20T22:51:10.492Z",
		"update_at": "2024-01-20T22:59:48.333Z",
		"instances": [
			{
				"avzone": "us-central-1a",
				"cluster": "sassyseal"
			}
		],
		"access": "",
		"license": "",
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x786A1F3875B78ED1807719814F43B8F4C7302e6a": 1
			},
			"asks_updated": "2024-01-27T09:20:00.296093392Z",
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
			"throughput_in": 1.8,
			"throughput_out": 9.866666666666667,
			"stats": [
				{
					"avzone": "us-central-1a",
					"cluster": "sassyseal",
					"capacity": 0.045454545454545456,
					"qps": 0.13333333333333333,
					"throughput_in": 1.8,
					"throughput_out": 9.866666666666667,
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
				"0x764612b874fA44815c872f8A6C4EAbE0414011be": 1
			},
			"asks_updated": "2024-01-28T11:42:15.431615483Z",
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
			"throughput_out": 8.533333333333333,
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
				},
				{
					"avzone": "us-central-1a",
					"cluster": "sassyseal",
					"capacity": 0.1111111111111111,
					"qps": 0.06666666666666667,
					"throughput_in": 0.4666666666666667,
					"throughput_out": 8.533333333333333,
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
			"num_asks": 2,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x053b963a4B9675640f6c2303e022085352304300": 1,
				"0x1A6E16Ebf00e4ebf8413D7B63C4BD5De9b9aE69f": 1
			},
			"asks_updated": "2024-01-28T11:02:15.237703765Z",
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
					"capacity": 0.05263157894736842,
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
			"num_asks": 3,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x23096d3C0409D83Eb50a686C4B6564C484e79874": 1,
				"0x7da823447CBFd3aDb9BE36f7EcE31af9EEF43fEb": 1,
				"0xDD82Bf96cc9A353e2fb926468D4549203eec5410": 1
			},
			"asks_updated": "2024-01-28T04:30:58.037196494Z",
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
					"capacity": 0.05263157894736842,
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
			"asks_updated": "2024-01-27T19:32:09.830790175Z",
			"gpus": {
				"NVIDIA A40": 1
			},
			"options": {
				"input=text,image": 1
			},
			"qps": 0.016473085,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 0.3294617
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
				"0x98FC7Ae285bd96dA3A1fCD068F114BBb6C1698Cf": 1
			},
			"asks_updated": "2024-01-27T12:00:29.097770657Z",
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
				"0xa916df84D25D2421a3DEea5Ca652C1e5d47979A0": 1
			},
			"asks_updated": "2024-01-28T10:04:25.093318113Z",
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
			"asks_updated": "2024-01-27T10:16:03.845391838Z",
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
				"0x71F64AFd79612d3405e488CDFe3b319fE4e44453": 1
			},
			"asks_updated": "2024-01-27T11:04:59.973138129Z",
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
					"capacity": 0.05263157894736842,
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
			"asks_updated": "2024-01-27T12:15:56.243148431Z",
			"gpus": {
				"": 0
			},
			"qps": 3.6,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 3823.9333333333334,
			"throughput_out": 114.33333333333333,
			"retry_rate": 87.8,
			"stats": [
				{
					"avzone": "us-east-2a",
					"cluster": "jumpyjackal",
					"capacity": 1.017225325884543,
					"qps": 3.6,
					"throughput_in": 3823.9333333333334,
					"throughput_out": 114.33333333333333,
					"error_rate": 0,
					"retry_rate": 87.8
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
			"asks_updated": "2024-01-28T11:02:14.043233314Z",
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
			"num_asks": 5,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x0b29d9896C55EAaebb969eF1823DBb0f589538E8": 1,
				"0x5Db772c45b58EefE138373DED59B8c648a4bA89a": 1,
				"0x691E7ee9F5522c03309F6fBD602Cd4Eb86CF4419": 1,
				"0x79A249Da54510FA7cb756Ab5A03f5729789C1916": 1,
				"0xbCBEd934C6A9b1Abb6B22bd581370E9eAaE09E5B": 1
			},
			"asks_updated": "2024-01-28T08:46:47.217989875Z",
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
				"0xC2fa861b51f682C6DEffeC0521Eb7D24D913E717": 1
			},
			"asks_updated": "2024-01-27T12:03:10.893984523Z",
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
			"throughput_out": 8.533333333333333,
			"stats": [
				{
					"avzone": "us-central-1a",
					"cluster": "sassyseal",
					"capacity": 0.14285714285714285,
					"qps": 0.06666666666666667,
					"throughput_in": 0.4666666666666667,
					"throughput_out": 8.533333333333333,
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
				"0x75c42C746f45AC32cb8f15522F919ad25d0769fA": 1
			},
			"asks_updated": "2024-01-28T09:52:32.770982452Z",
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
					"capacity": 0.10389610389610392,
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
				"0x6cdA20330714Fde76167809E8915c2cF52469A4E": 1
			},
			"asks_updated": "2024-01-28T09:55:25.27760955Z",
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
			"throughput_in": 1.8,
			"throughput_out": 9.866666666666667,
			"stats": [
				{
					"avzone": "us-central-1a",
					"cluster": "sassyseal",
					"capacity": 0.04545454545454545,
					"qps": 0.13333333333333333,
					"throughput_in": 1.8,
					"throughput_out": 9.866666666666667,
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
		"_id": "65b40661251b2ff9f146d8ba",
		"name": "microsoft/phi-2",
		"display_name": "Microsoft Phi-2",
		"display_type": "language",
		"description": "Phi-2 is a Transformer with 2.7 billion parameters. It was trained using the same data sources as Phi-1.5, augmented with a new data source that consists of various NLP synthetic texts and filtered websites (for safety and educational value)",
		"license": "mit",
		"link": "https://huggingface.co/microsoft/phi-2",
		"creator_organization": "Microsoft",
		"pricing_tier": "Featured",
		"num_parameters": 2700000000,
		"release_date": "2024-01-26T19:22:09.533Z",
		"show_in_playground": true,
		"isFeaturedModel": true,
		"context_length": 2048,
		"pricing": {
			"input": 25,
			"output": 25,
			"hourly": 0
		},
		"created_at": "2024-01-26T19:22:09.533Z",
		"update_at": "2024-01-26T19:23:46.072Z",
		"instances": [
			{
				"avzone": "us-central-5a",
				"cluster": "wrigleycub"
			}
		],
		"access": "",
		"hardware_label": "",
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0xD13D60186eC2F972F3290F6e9E4994d67923e5fe": 1
			},
			"asks_updated": "2024-01-27T10:47:55.376176844Z",
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
					"avzone": "us-central-5a",
					"cluster": "wrigleycub",
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
			"tools_template": "{{ '<<SYS>>\\n' + systemMessage['content'] + '\\n\\nYou can access the following functions. Use them if required -\\n' + tools + '\\n<</SYS>>\\n\\n' + message['content'] }}"
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
				"avzone": "ap-northeast-1a",
				"cluster": "optimisticotter"
			},
			{
				"avzone": "us-central-2a",
				"cluster": "jollyllama"
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
				"0xd67c558915095d7fe3D8762B09eb97A143202602": 1
			},
			"asks_updated": "2024-01-27T23:11:23.831011141Z",
			"gpus": {
				"": 0
			},
			"qps": 1.7333333333333334,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 370.73333333333335,
			"throughput_out": 236.13333333333333,
			"retry_rate": 2,
			"stats": [
				{
					"avzone": "ap-northeast-1a",
					"cluster": "optimisticotter",
					"capacity": 0.16076388888888898,
					"qps": 1.7333333333333334,
					"throughput_in": 370.73333333333335,
					"throughput_out": 236.13333333333333,
					"error_rate": 0,
					"retry_rate": 2
				},
				{
					"avzone": "us-central-2a",
					"cluster": "jollyllama",
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
				"avzone": "ap-northeast-1a",
				"cluster": "optimisticotter"
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
			"num_asks": 8,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x350Ac4bd8f284c24689D481A0781C23B3b556a27": 1,
				"0x410E34c509337944cf3D5668e5C261608690A73C": 1,
				"0x5EcDb6E5f850280085e17986273c98432bE1bDBB": 1,
				"0xF0f3b7a1339d7540e3EdA47C1f4CF45406247ff8": 1,
				"0xb262c98cd2075D6bc8EDe59551cdD62dFc33c5a8": 1,
				"0xbcf0e2D261ed3272416FAdca618bD000E4dB75e8": 1,
				"0xcb5e44ec9A7942F4C3064a65fCFc1C21e2449B8e": 1,
				"0xdF958d30F85c7caD3F8630840F72FA162323994c": 1,
				"0xf162Ce79587d1Cfe351603683D59d352D7963CbA": 1
			},
			"asks_updated": "2024-01-28T11:37:20.209308809Z",
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
			"throughput_in": 1.7999999999999998,
			"throughput_out": 9.866666666666667,
			"stats": [
				{
					"avzone": "ap-northeast-1a",
					"cluster": "optimisticotter",
					"capacity": 0.05263157894736842,
					"qps": 0.06666666666666667,
					"throughput_in": 0.4666666666666667,
					"throughput_out": 8.533333333333333,
					"error_rate": 0,
					"retry_rate": 0
				},
				{
					"avzone": "us-central-1a",
					"cluster": "sassyseal",
					"capacity": 0.1111111111111111,
					"qps": 0.06666666666666667,
					"throughput_in": 1.3333333333333333,
					"throughput_out": 1.3333333333333333,
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
				"avzone": "us-central-2a",
				"cluster": "jollyllama"
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
				"0xFf846afd22c38E7cb1E12d0661c9Fd5CE0a375B6": 1
			},
			"asks_updated": "2024-01-27T10:53:36.066176197Z",
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
			"throughput_out": 8.533333333333333,
			"stats": [
				{
					"avzone": "us-central-2a",
					"cluster": "jollyllama",
					"capacity": 0.25,
					"qps": 0.06666666666666667,
					"throughput_in": 0.4666666666666667,
					"throughput_out": 8.533333333333333,
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
			"chat_template_name": "llama",
			"tools_template": "{{ '<<SYS>>\\n' + systemMessage['content'] + '\\n\\nYou can access the following functions. Use them if required -\\n' + tools + '\\n<</SYS>>\\n\\n' + message['content'] }}"
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
			},
			{
				"avzone": "us-central-5a",
				"cluster": "wrigleycub"
			}
		],
		"hardware_label": "",
		"descriptionLink": "",
		"depth": {
			"num_asks": 15,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x064b205Eb742312BAbBCA35e271761E5954c4667": 1,
				"0x0f821C50562315A252fEE9b66103c3E3d9375971": 1,
				"0x338C3AE7830c7D31837F6f2A1c43aEf630A249BB": 1,
				"0x34a967702d0071579F47eFF632D58D7A235e9a26": 1,
				"0x5108488D900AC93C5DBd42AcACD190fBA77b7084": 1,
				"0x551f2889FF97a812668c584fff5Da268234fde10": 1,
				"0x555A4454465AfdB6c208745a9cC47b8A98307B9b": 1,
				"0x5Ba73D7cB470ef21DEE441a2eb168A2ae8331B3D": 1,
				"0x60D937AFcC4f2AFd2A25610094Cd4149612Ef986": 1,
				"0x8aE0216c6cfF5470d33e156Dc08D100EC9D31173": 1,
				"0x9a8a5Eca5ED0d77c6165a302DeE6ef8Bee7d2724": 1,
				"0xA339F5b1e2bf8123be1B565355A842432757e44C": 1,
				"0xD547C6DEdcD8410FCd39B3588A14e5665A3F8a5f": 1,
				"0xDe47AB74625Db038ba3662c41332155ac9b80541": 1,
				"0xca8734926B420a52F10438AFE3A09620be09F985": 1,
				"0xf6a4a9a56dc9D39521B8d1F1DF49D146915e41B5": 1
			},
			"asks_updated": "2024-01-28T11:30:59.141907995Z",
			"gpus": {
				"": 0
			},
			"qps": 12.066666666666666,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 15169.733333333334,
			"throughput_out": 2523.2,
			"error_rate": 0.06666666666666667,
			"retry_rate": 53.53333333333333,
			"stats": [
				{
					"avzone": "us-east-1a",
					"cluster": "happypiglet",
					"capacity": 0.20395890754196971,
					"qps": 6,
					"throughput_in": 7313.733333333334,
					"throughput_out": 1195.3333333333333,
					"error_rate": 0.06666666666666667,
					"retry_rate": 30.133333333333333
				},
				{
					"avzone": "us-central-5a",
					"cluster": "wrigleycub",
					"capacity": 0.23955067920585182,
					"qps": 6.066666666666666,
					"throughput_in": 7856,
					"throughput_out": 1327.8666666666666,
					"error_rate": 0,
					"retry_rate": 23.4
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
				"avzone": "ap-northeast-1a",
				"cluster": "optimisticotter"
			}
		],
		"hardware_label": "",
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0xABDf5E3162B18e8ddA01478386c88dC1021A7383": 1
			},
			"asks_updated": "2024-01-28T09:59:23.509143128Z",
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
			"throughput_in": 4.533333333333333,
			"throughput_out": 16.8,
			"stats": [
				{
					"avzone": "ap-northeast-1a",
					"cluster": "optimisticotter",
					"capacity": 0.02702702702702703,
					"qps": 0.13333333333333333,
					"throughput_in": 4.533333333333333,
					"throughput_out": 16.8,
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
			"asks_updated": "2024-01-28T10:31:00.847324865Z",
			"gpus": {
				"NVIDIA A40": 2
			},
			"options": {
				"input=text,image": 2
			},
			"qps": 0.009803828,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 0.19607656
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
			"asks_updated": "2024-01-27T10:31:07.335099037Z",
			"gpus": {
				"NVIDIA A40": 1
			},
			"options": {
				"input=text,image": 1
			},
			"qps": 0.010860239,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 0.21720478
		}
	},
	{
		"modelInstanceConfig": {
			"appearsIn": [],
			"order": 0
		},
		"_id": "65b454f3d9877b0bd1376470",
		"name": "snorkelai/Snorkel-Mistral-PairRM-DPO",
		"display_name": "Snorkel Mistral PairRM DPO",
		"display_type": "chat",
		"description": "A state-of-the-art model by Snorkel AI, DPO fine-tuned on Mistral-7B",
		"license": "apache-2.0",
		"creator_organization": "Snorkel AI",
		"pricing_tier": "Featured",
		"num_parameters": 7000000000,
		"release_date": "2024-01-27T00:57:23.638Z",
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
			"input": 50,
			"output": 50,
			"hourly": 0
		},
		"created_at": "2024-01-27T00:57:23.638Z",
		"update_at": "2024-01-27T14:24:41.745Z",
		"instances": [
			{
				"avzone": "us-central-2a",
				"cluster": "jollyllama"
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
				"0x03168eAc48df7A570E91C074901D11013A1881f4": 1,
				"0x116414bb6b0a40B37b90C880e59C6cF3E7196E74": 1
			},
			"asks_updated": "2024-01-27T10:22:40.42772748Z",
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
			"throughput_in": 230.33333333333334,
			"throughput_out": 27.266666666666666,
			"stats": [
				{
					"avzone": "us-central-2a",
					"cluster": "jollyllama",
					"capacity": 0.25,
					"qps": 0.13333333333333333,
					"throughput_in": 230.33333333333334,
					"throughput_out": 27.266666666666666,
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
			"asks_updated": "2024-01-27T11:41:26.576250365Z",
			"gpus": {
				"NVIDIA A100 80GB PCIe": 1
			},
			"options": {
				"input=text,image": 1
			},
			"qps": 0.020753827,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 0.41507655
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
			"asks_updated": "2024-01-28T03:28:40.512213181Z",
			"gpus": {
				"NVIDIA A100 80GB PCIe": 1
			},
			"options": {
				"input=text,image": 1
			},
			"qps": 0.07634915,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 27.084574
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
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x0916A27F8b14De53BE968F395dFb041b1564d828": 1,
				"0x7dC61AB36Cd89be8C43e0725D8DC1480710c677D": 1,
				"0x9f850AC6941891f0ce2893F67f97DBc0f3839cDB": 1
			},
			"asks_updated": "2024-01-28T08:01:01.713577145Z",
			"gpus": {
				"": 0
			},
			"qps": 0.4666666666666667,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 400.5333333333333,
			"throughput_out": 61.86666666666666,
			"stats": [
				{
					"avzone": "us-east-2a",
					"cluster": "jumpyjackal",
					"capacity": 0.05681818181818182,
					"qps": 0,
					"throughput_in": 0,
					"throughput_out": 0,
					"error_rate": 0,
					"retry_rate": 0
				},
				{
					"avzone": "us-central-1a",
					"cluster": "sassyseal",
					"capacity": 0.05194805194805195,
					"qps": 0.3333333333333333,
					"throughput_in": 220.86666666666667,
					"throughput_out": 42.53333333333333,
					"error_rate": 0,
					"retry_rate": 0
				},
				{
					"avzone": "us-central-5a",
					"cluster": "wrigleycub",
					"capacity": 0.13333333333333336,
					"qps": 0.13333333333333333,
					"throughput_in": 179.66666666666666,
					"throughput_out": 19.333333333333332,
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
				"0xD7BC9F96850b54dBbaC1A4938D34c500Fbee2E8A": 1
			},
			"asks_updated": "2024-01-28T06:51:52.324521917Z",
			"gpus": {
				"": 0
			},
			"qps": 2.3333333333333335,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 2619.3333333333335,
			"throughput_out": 457.8,
			"retry_rate": 0.3333333333333333,
			"stats": [
				{
					"avzone": "us-east-2a",
					"cluster": "jumpyjackal",
					"capacity": 0.2675061425061425,
					"qps": 2.3333333333333335,
					"throughput_in": 2619.3333333333335,
					"throughput_out": 457.8,
					"error_rate": 0,
					"retry_rate": 0.3333333333333333
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
				"0xd90aeCe81bf3FA14FbB303533A8d88323A3CD3C4": 1
			},
			"asks_updated": "2024-01-28T05:36:38.771760047Z",
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
			"throughput_in": 2.066666666666667,
			"throughput_out": 11.066666666666666,
			"stats": [
				{
					"avzone": "us-central-1a",
					"cluster": "sassyseal",
					"capacity": 0.2222222222222222,
					"qps": 0.13333333333333333,
					"throughput_in": 2.066666666666667,
					"throughput_out": 11.066666666666666,
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
				"0x087EEbB518f2C3245B6651FEE9F591DFAEa3629e": 1
			},
			"asks_updated": "2024-01-28T05:40:55.983880128Z",
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
			"throughput_in": 1,
			"throughput_out": 17.066666666666666,
			"stats": [
				{
					"avzone": "us-central-1a",
					"cluster": "sassyseal",
					"capacity": 0.2222222222222222,
					"qps": 0.13333333333333333,
					"throughput_in": 1,
					"throughput_out": 17.066666666666666,
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
				"0xD91496Fbe55E9268b35Bcbe45F4C18a6805908AE": 1
			},
			"asks_updated": "2024-01-27T11:43:18.546449802Z",
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
			"throughput_in": 1.2,
			"throughput_out": 9.2,
			"stats": [
				{
					"avzone": "us-central-1a",
					"cluster": "sassyseal",
					"capacity": 0.2222222222222222,
					"qps": 0.13333333333333333,
					"throughput_in": 1.2,
					"throughput_out": 9.2,
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
			"chat_template_name": "llama",
			"tools_template": "{{ '<<SYS>>\\n' + systemMessage['content'] + '\\n\\nYou can access the following functions. Use them if required -\\n' + tools + '\\n<</SYS>>\\n\\n' + message['content'] }}"
		},
		"pricing": {
			"input": 194,
			"output": 194,
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
			"num_asks": 2,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x931FF9601c0032CC0edC79eD1A71cf2d98ef04Fe": 1,
				"0xB5E95DAB94e739500cB80389B5641411C21CD4aF": 1
			},
			"asks_updated": "2024-01-28T11:28:40.078419964Z",
			"gpus": {
				"": 0
			},
			"qps": 0.6,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 185.8,
			"throughput_out": 350.73333333333335,
			"stats": [
				{
					"avzone": "us-central-1a",
					"cluster": "sassyseal",
					"capacity": 0.3201754385964913,
					"qps": 0.6,
					"throughput_in": 185.8,
					"throughput_out": 350.73333333333335,
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
			"input": 194,
			"output": 194,
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
			"num_asks": 4,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x39537072Cd98262a94E40ea2783266AB7EdA7986": 1,
				"0x9A42A3f5AE541119d3afFa761C968351ED0ffF83": 1,
				"0xc6D3883Ec197E2665E17dfA7C1867943C24DD0b3": 1,
				"0xf3121679Bc8b5C884a60d69A491Bdd4dE5381A17": 1
			},
			"asks_updated": "2024-01-28T11:33:57.319591179Z",
			"gpus": {
				"": 0
			},
			"qps": 12.4,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 4539.066666666667,
			"throughput_out": 589.5333333333333,
			"stats": [
				{
					"avzone": "us-central-1a",
					"cluster": "sassyseal",
					"capacity": 0.5501631662622386,
					"qps": 12.4,
					"throughput_in": 4539.066666666667,
					"throughput_out": 589.5333333333333,
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
			"input": 194,
			"output": 194,
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
				"0x3C53215aA6a1B28eEE542036972eaE62Bb3fB488": 1
			},
			"asks_updated": "2024-01-27T11:05:31.098670997Z",
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
			"throughput_in": 2.066666666666667,
			"throughput_out": 2,
			"stats": [
				{
					"avzone": "us-central-1a",
					"cluster": "sassyseal",
					"capacity": 0.05263157894736842,
					"qps": 0.13333333333333333,
					"throughput_in": 2.066666666666667,
					"throughput_out": 2,
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
				"0x3A592173A8298D1889d19F8cc84dEf7624293532": 1
			},
			"asks_updated": "2024-01-28T08:21:04.822204375Z",
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
			"throughput_in": 2.066666666666667,
			"throughput_out": 10.8,
			"stats": [
				{
					"avzone": "us-east-2a",
					"cluster": "jumpyjackal",
					"capacity": 0.3333333333333333,
					"qps": 0.13333333333333333,
					"throughput_in": 2.066666666666667,
					"throughput_out": 10.8,
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
				"0xC1F78f5A837eA668e529d67eb4fFf9c296bbd322": 1
			},
			"asks_updated": "2024-01-28T09:57:54.650595116Z",
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
			"throughput_in": 0.5333333333333333,
			"throughput_out": 8.533333333333333,
			"stats": [
				{
					"avzone": "us-east-2a",
					"cluster": "jumpyjackal",
					"capacity": 0.25,
					"qps": 0.06666666666666667,
					"throughput_in": 0.5333333333333333,
					"throughput_out": 8.533333333333333,
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
				"0x0D8dCF916D963FE585B1c5C7D39679436392c2ab": 1
			},
			"asks_updated": "2024-01-27T11:56:01.072179233Z",
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
			"throughput_in": 2.533333333333333,
			"throughput_out": 10.533333333333333,
			"stats": [
				{
					"avzone": "us-east-2a",
					"cluster": "jumpyjackal",
					"capacity": 0.3333333333333333,
					"qps": 0.2,
					"throughput_in": 2.533333333333333,
					"throughput_out": 10.533333333333333,
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
			},
			{
				"avzone": "us-central-5a",
				"cluster": "wrigleycub"
			}
		],
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x8AD0e2680EbF209793Cf8826BE6e68d8b119448D": 1,
				"0xfe3449B977e9d3911bd38b54c0Ddc46f53878fE5": 1
			},
			"asks_updated": "2024-01-27T12:24:29.374928135Z",
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
				},
				{
					"avzone": "us-central-5a",
					"cluster": "wrigleycub",
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
		"instances": [
			{
				"avzone": "us-central-5a",
				"cluster": "testytiger"
			}
		],
		"descriptionLink": "",
		"depth": {
			"num_asks": 2,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x49916E2a07BD2bd24F0414BAc7d060A8e3CCA1f6": 1,
				"0x706627e602aa4AA1a4685C10c3ebdF8a8CF71A43": 1
			},
			"asks_updated": "2024-01-27T11:08:14.858317213Z",
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
			"throughput_in": 0.4,
			"throughput_out": 2.2666666666666666,
			"stats": [
				{
					"avzone": "us-central-5a",
					"cluster": "testytiger",
					"capacity": 0.05,
					"qps": 0.06666666666666667,
					"throughput_in": 0.4,
					"throughput_out": 2.2666666666666666,
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
		"instances": [
			{
				"avzone": "us-central-5a",
				"cluster": "testytiger"
			}
		],
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0xd8Cef20eB9321e3f121B4B253EA6d8C0E4Accb81": 1
			},
			"asks_updated": "2024-01-27T11:14:16.117506302Z",
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
			"throughput_in": 1.2666666666666666,
			"throughput_out": 1.3333333333333333,
			"stats": [
				{
					"avzone": "us-central-5a",
					"cluster": "testytiger",
					"capacity": 0.0078125,
					"qps": 0.06666666666666667,
					"throughput_in": 1.2666666666666666,
					"throughput_out": 1.3333333333333333,
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
			"num_asks": 2,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x06e3D009eDb9F29bB81E878d225C0d5220E30621": 1,
				"0xF5C8C993ad24B700535Add7ad22A28BbE7F48e6e": 1
			},
			"asks_updated": "2024-01-28T07:13:57.340947531Z",
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
			"throughput_in": 0.4,
			"throughput_out": 8.533333333333333,
			"stats": [
				{
					"avzone": "us-east-2a",
					"cluster": "jumpyjackal",
					"capacity": 1,
					"qps": 0.06666666666666667,
					"throughput_in": 0.4,
					"throughput_out": 8.533333333333333,
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
			"num_asks": 2,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0xE2f8c6Ca58F16683C2F5d6faAD728C6D054347Eb": 1,
				"0xF3A9F6CcD6c970e921fe7D47d0839C437012f653": 1
			},
			"asks_updated": "2024-01-28T10:42:34.979239114Z",
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
			"throughput_in": 1.8,
			"throughput_out": 9.866666666666667,
			"stats": [
				{
					"avzone": "us-east-2a",
					"cluster": "jumpyjackal",
					"capacity": 1,
					"qps": 0.13333333333333333,
					"throughput_in": 1.8,
					"throughput_out": 9.866666666666667,
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
				"0xdBC2C35dDcBD80f4DD880ff3Fb9f76935d22A0c3": 1
			},
			"asks_updated": "2024-01-27T10:44:03.747776503Z",
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
			"throughput_in": 1.2666666666666666,
			"throughput_out": 1.3333333333333333,
			"stats": [
				{
					"avzone": "us-central-1a",
					"cluster": "sassyseal",
					"capacity": 0.0078125,
					"qps": 0.06666666666666667,
					"throughput_in": 1.2666666666666666,
					"throughput_out": 1.3333333333333333,
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
			"asks_updated": "2024-01-27T09:55:59.892347873Z",
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
			"throughput_in": 546.0666666666667,
			"throughput_out": 8.533333333333333,
			"stats": [
				{
					"avzone": "us-east-2a",
					"cluster": "jumpyjackal",
					"capacity": 0.0078125,
					"qps": 0.06666666666666667,
					"throughput_in": 546.0666666666667,
					"throughput_out": 8.533333333333333,
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
			"asks_updated": "2024-01-28T04:30:52.715305813Z",
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
			"throughput_in": 546.0666666666667,
			"throughput_out": 8.533333333333333,
			"stats": [
				{
					"avzone": "us-east-2a",
					"cluster": "jumpyjackal",
					"capacity": 0.0078125,
					"qps": 0.06666666666666667,
					"throughput_in": 546.0666666666667,
					"throughput_out": 8.533333333333333,
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
		"instances": [
			{
				"avzone": "us-central-5a",
				"cluster": "testytiger"
			}
		],
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x3a6A7E635309874281c01346Ad2af7750b54f47f": 1
			},
			"asks_updated": "2024-01-27T11:58:36.515438041Z",
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
			"throughput_in": 0.4,
			"throughput_out": 8.533333333333333,
			"stats": [
				{
					"avzone": "us-central-5a",
					"cluster": "testytiger",
					"capacity": 0.0078125,
					"qps": 0.06666666666666667,
					"throughput_in": 0.4,
					"throughput_out": 8.533333333333333,
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
		"instances": [
			{
				"avzone": "us-central-5a",
				"cluster": "testytiger"
			}
		],
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x2591d174b8795694fCf407B3710e67820241de1f": 1
			},
			"asks_updated": "2024-01-27T09:28:05.592333371Z",
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
			"throughput_in": 0.4,
			"throughput_out": 0.4666666666666667,
			"stats": [
				{
					"avzone": "us-central-5a",
					"cluster": "testytiger",
					"capacity": 0.0078125,
					"qps": 0.06666666666666667,
					"throughput_in": 0.4,
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
		"instances": [
			{
				"avzone": "us-central-5a",
				"cluster": "testytiger"
			}
		],
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x16b5700Ec8510e8eA86205DF2Ffabc536156e3cd": 1
			},
			"asks_updated": "2024-01-27T10:51:27.547726717Z",
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
					"avzone": "us-central-5a",
					"cluster": "testytiger",
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
		"instances": [
			{
				"avzone": "us-central-5a",
				"cluster": "testytiger"
			}
		],
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x0F9E25230ed9Cb2979C2F8E263cc463F8437FC12": 1
			},
			"asks_updated": "2024-01-27T11:34:35.816276872Z",
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
					"avzone": "us-central-5a",
					"cluster": "testytiger",
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
		"instances": [
			{
				"avzone": "us-central-5a",
				"cluster": "testytiger"
			}
		],
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x5Ea975bA97366270Cc57a20562dfFe237341a76A": 1
			},
			"asks_updated": "2024-01-27T09:35:57.224123266Z",
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
			"throughput_in": 0.4,
			"throughput_out": 8.533333333333333,
			"stats": [
				{
					"avzone": "us-central-5a",
					"cluster": "testytiger",
					"capacity": 0.0078125,
					"qps": 0.06666666666666667,
					"throughput_in": 0.4,
					"throughput_out": 8.533333333333333,
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
		"instances": [
			{
				"avzone": "us-central-5a",
				"cluster": "testytiger"
			}
		],
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0xb640F1F9aD0e7f87C2e735c6c8242c1867dec2Cf": 1
			},
			"asks_updated": "2024-01-27T11:33:31.790618051Z",
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
					"avzone": "us-central-5a",
					"cluster": "testytiger",
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
				"avzone": "ap-northeast-1a",
				"cluster": "optimisticotter"
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
				"0x887499d64E5D15D0fEE7F6733C59094d05Ea7176": 1
			},
			"asks_updated": "2024-01-27T23:12:16.941004637Z",
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
			"throughput_out": 8.533333333333333,
			"stats": [
				{
					"avzone": "ap-northeast-1a",
					"cluster": "optimisticotter",
					"capacity": 0.03571428571428571,
					"qps": 0.06666666666666667,
					"throughput_in": 0.4666666666666667,
					"throughput_out": 8.533333333333333,
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
		"instances": [
			{
				"avzone": "us-central-5a",
				"cluster": "wrigleycub"
			}
		],
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0xc3dCAEFb2fB24EcAf7C84eFeB4c59D6Ae1308290": 1
			},
			"asks_updated": "2024-01-27T11:07:23.345484536Z",
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
					"avzone": "us-central-5a",
					"cluster": "wrigleycub",
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
		"instances": [
			{
				"avzone": "us-central-5a",
				"cluster": "wrigleycub"
			}
		],
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x36965DA0006E1B014eF3eA631C2B745AfB31452c": 1
			},
			"asks_updated": "2024-01-27T09:06:04.849021201Z",
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
			"throughput_in": 1.2666666666666666,
			"throughput_out": 1.3333333333333333,
			"error_rate": 0.06666666666666667,
			"stats": [
				{
					"avzone": "us-central-5a",
					"cluster": "wrigleycub",
					"capacity": 0.0078125,
					"qps": 0.06666666666666667,
					"throughput_in": 1.2666666666666666,
					"throughput_out": 1.3333333333333333,
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
		"instances": [
			{
				"avzone": "us-central-5a",
				"cluster": "wrigleycub"
			}
		],
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0xa7Fa07E7B1dFCaDC6846172ab1C5BCd9AFb754D7": 1
			},
			"asks_updated": "2024-01-27T09:26:27.947437125Z",
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
			"throughput_in": 1.6666666666666667,
			"throughput_out": 3,
			"stats": [
				{
					"avzone": "us-central-5a",
					"cluster": "wrigleycub",
					"capacity": 0.0078125,
					"qps": 0.13333333333333333,
					"throughput_in": 1.6666666666666667,
					"throughput_out": 3,
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
		"instances": [
			{
				"avzone": "us-central-5a",
				"cluster": "wrigleycub"
			}
		],
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x925BBAC0441f02F46Af7A284D6FFFA7F885760C2": 1
			},
			"asks_updated": "2024-01-27T12:07:53.700108074Z",
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
			"throughput_in": 0.4,
			"throughput_out": 0.8666666666666667,
			"stats": [
				{
					"avzone": "us-central-5a",
					"cluster": "wrigleycub",
					"capacity": 0.0078125,
					"qps": 0.06666666666666667,
					"throughput_in": 0.4,
					"throughput_out": 0.8666666666666667,
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
				"0x9850d8e4d64618A890aE5F8D050D6C10cCd4bf81": 1
			},
			"asks_updated": "2024-01-28T09:36:38.98933668Z",
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
			"throughput_out": 8.533333333333333,
			"stats": [
				{
					"avzone": "us-central-1a",
					"cluster": "sassyseal",
					"capacity": 0.27999999999999997,
					"qps": 0.06666666666666667,
					"throughput_in": 0.4666666666666667,
					"throughput_out": 8.533333333333333,
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
				"0x61Ba41B5D30c04De97499543dE3A767e21D258eB": 1
			},
			"asks_updated": "2024-01-28T04:18:19.847851295Z",
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
			"throughput_in": 0.8666666666666667,
			"throughput_out": 9.733333333333333,
			"stats": [
				{
					"avzone": "us-central-1a",
					"cluster": "sassyseal",
					"capacity": 0.13333333333333333,
					"qps": 0.13333333333333333,
					"throughput_in": 0.8666666666666667,
					"throughput_out": 9.733333333333333,
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
			"num_asks": 4,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x63327E269412d4e83dcB0559907EcEa61FAAf9e2": 1,
				"0x6D3936E8f511F8860d481c3Dda33A639833fF225": 1,
				"0x9d2Fc82264e1954a18F38D1768b6cBc281D9FA34": 1,
				"0xffe42ef3D9C162444CA850900ecd41B05Fd8dE86": 1
			},
			"asks_updated": "2024-01-28T08:24:38.442976283Z",
			"gpus": {
				"": 0
			},
			"qps": 3.533333333333333,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 1994.9333333333334,
			"throughput_out": 641.0666666666667,
			"retry_rate": 0.5333333333333333,
			"stats": [
				{
					"avzone": "us-east-1a",
					"cluster": "happypiglet",
					"capacity": 0.04811789772727273,
					"qps": 3.533333333333333,
					"throughput_in": 1994.9333333333334,
					"throughput_out": 641.0666666666667,
					"error_rate": 0,
					"retry_rate": 0.5333333333333333
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
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0xe2B7d404dDfaA98EAdbe21643919B5eFcce0ca8e": 1
			},
			"asks_updated": "2024-01-27T14:50:26.315667296Z",
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
			"throughput_in": 0.8666666666666667,
			"throughput_out": 9.8,
			"stats": [
				{
					"avzone": "us-east-1a",
					"cluster": "happypiglet",
					"capacity": 0.021551724137931036,
					"qps": 0.13333333333333333,
					"throughput_in": 0.8666666666666667,
					"throughput_out": 9.8,
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
				"0x986F1d5bcFA6F2902847b716c7C99b558916cf75": 1
			},
			"asks_updated": "2024-01-28T09:41:52.408697226Z",
			"gpus": {
				"": 0
			},
			"qps": 0.4,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 96.53333333333333,
			"throughput_out": 155.4,
			"stats": [
				{
					"avzone": "us-central-1a",
					"cluster": "sassyseal",
					"capacity": 0.162,
					"qps": 0.4,
					"throughput_in": 96.53333333333333,
					"throughput_out": 155.4,
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
				"0x370dfBC1cc49e89f208150381Eb121E4C7271BF9": 1
			},
			"asks_updated": "2024-01-27T11:03:44.941585819Z",
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
			"throughput_in": 2.2,
			"throughput_out": 11.333333333333334,
			"stats": [
				{
					"avzone": "us-central-1a",
					"cluster": "sassyseal",
					"capacity": 0.05000000000000001,
					"qps": 0.2,
					"throughput_in": 2.2,
					"throughput_out": 11.333333333333334,
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
			"num_asks": 2,
			"num_bids": 0,
			"num_running": 0,
			"asks": {
				"0x657c72806A9e3F05127c5098259511De0d6c91a1": 1,
				"0x7b3c570D43A98071D51C84DdC4E5fdEeFA6b474C": 1
			},
			"asks_updated": "2024-01-28T02:44:07.670609849Z",
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
			"throughput_in": 2.2666666666666666,
			"throughput_out": 18.4,
			"stats": [
				{
					"avzone": "us-central-1a",
					"cluster": "sassyseal",
					"capacity": 0.0078125,
					"qps": 0.2,
					"throughput_in": 2.2666666666666666,
					"throughput_out": 18.4,
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
		"_id": "657f7552a9c4049b6a42e4c6",
		"name": "upstage/SOLAR-10.7B-Instruct-v1.0",
		"display_name": "Upstage SOLAR Instruct v1 (11B)",
		"display_type": "chat",
		"description": "Built on the Llama2 architecture, SOLAR-10.7B incorporates the innovative Upstage Depth Up-Scaling",
		"license": "cc-by-nc-4.0",
		"creator_organization": "upstage",
		"hardware_label": "A100B",
		"pricing_tier": "Featured",
		"num_parameters": 10700000000,
		"release_date": "2023-12-01T00:00:00.000Z",
		"show_in_playground": true,
		"isFeaturedModel": true,
		"config": {
			"stop": [
				"###",
				"</s>"
			],
			"prompt_format": "<s> ### User:\n{prompt}\n### Assistant:\n"
		},
		"pricing": {
			"input": 75,
			"output": 75
		},
		"created_at": "2023-12-17T22:25:22.252Z",
		"update_at": "2023-12-17T22:32:58.075Z",
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
				"0xa69DE9F0Af3D471069cd1C33e1A6d524e192a23D": 1
			},
			"asks_updated": "2024-01-28T10:19:47.75593533Z",
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
			"asks_updated": "2024-01-27T10:21:11.913713377Z",
			"gpus": {
				"NVIDIA A40": 1
			},
			"options": {
				"input=text,image": 1
			},
			"qps": 0.013694377,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 0.27388754
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
				"0x3d3d04D907E5C66532766A746932EdbAA33f4D82": 1
			},
			"asks_updated": "2024-01-28T08:47:35.800766093Z",
			"gpus": {
				"": 0
			},
			"qps": 0.5333333333333333,
			"permit_required": false,
			"price": {
				"base": 0,
				"finetune": 0,
				"hourly": 0,
				"input": 0,
				"output": 0
			},
			"throughput_in": 322.26666666666665,
			"throughput_out": 303.6666666666667,
			"retry_rate": 0.8,
			"stats": [
				{
					"avzone": "us-east-2a",
					"cluster": "jumpyjackal",
					"capacity": 0.46012544802867367,
					"qps": 0.5333333333333333,
					"throughput_in": 322.26666666666665,
					"throughput_out": 303.6666666666667,
					"error_rate": 0,
					"retry_rate": 0.8
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
				"0x30bc352981eE5B08C0eAFc3c0C8d24C5026A4637": 1
			},
			"asks_updated": "2024-01-28T10:06:44.364931344Z",
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
					"capacity": 0.016129032258064516,
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
				"0x66cF06b006C16aaB80340d21C528D87fCa2D61Ce": 1
			},
			"asks_updated": "2024-01-27T10:23:59.103187882Z",
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
			"throughput_in": 0.4,
			"throughput_out": 8.533333333333333,
			"stats": [
				{
					"avzone": "us-east-2a",
					"cluster": "jumpyjackal",
					"capacity": 0.0078125,
					"qps": 0.06666666666666667,
					"throughput_in": 0.4,
					"throughput_out": 8.533333333333333,
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
		"finetuning_supported": true,
		"isFeaturedModel": true,
		"context_length": 32768,
		"pricing": {
			"input": 150,
			"output": 150,
			"hourly": 0
		},
		"created_at": "2023-12-12T02:01:52.674Z",
		"update_at": "2023-12-12T02:01:52.674Z",
		"autopilot_pool": "cr-a100-80-2x",
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
				"avzone": "ap-northeast-1a",
				"cluster": "optimisticotter"
			}
		],
		"access": "",
		"link": "",
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
					"avzone": "ap-northeast-1a",
					"cluster": "optimisticotter",
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
		"instances": [
			{
				"avzone": "us-central-5a",
				"cluster": "wrigleycub"
			}
		],
		"access": "",
		"link": "",
		"descriptionLink": "",
		"depth": {
			"num_asks": 1,
			"num_bids": 0,
			"num_running": 0,
			"qps": 0.13333333333333333,
			"throughput_in": 1.8,
			"throughput_out": 9.866666666666667,
			"error_rate": 0,
			"retry_rate": 0,
			"stats": [
				{
					"avzone": "us-central-5a",
					"cluster": "wrigleycub",
					"capacity": 0.25,
					"qps": 0.13333333333333333,
					"throughput_in": 1.8,
					"throughput_out": 9.866666666666667,
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
			"qps": 0,
			"throughput_in": 0,
			"throughput_out": 0,
			"error_rate": 0,
			"retry_rate": 0,
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
		"_id": "657bed666aca120ac2af2fb7",
		"name": "HuggingFaceH4/zephyr-7b-beta",
		"display_name": "Zephyr-7B-ß",
		"display_type": "chat",
		"description": "A fine-tuned version of Mistral-7B to act as a helpful assistant.",
		"license": "",
		"link": "",
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
		"descriptionLink": "",
		"pricing": {
			"hourly": 0,
			"input": 0,
			"output": 0,
			"base": 0,
			"finetune": 0
		}
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

models = models.map(model => {
	model.shortName = model.name.split('/')[1];
	model.fullName = model.name;
	return model;
});
models = models.sort((a, b) => a.shortName.toLowerCase().localeCompare(b.shortName.toLowerCase()));

for (const mod of models) {
	if (mod.display_type !== "chat" && mod.display_type !== "code") {
		continue;
	}
	if (!mod.instances) {
		continue;
	}
	console.log(`{shortName: "${mod.shortName}", fullName: "${mod.fullName}"},`);
}

console.log("FAIRE GPT AUSSI");
