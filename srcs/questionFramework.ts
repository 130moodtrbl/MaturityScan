/**
 *      Simple question template featuring NIST Cybersecurity Framework;
 *              - Identify, Protect, Detect, Respond, Recover
 *      This template remains simple and easy to use for a quick evaluation.
 *      There is plenty of room for improvement, for instance, interactive questions
 *      through a GUI or CLI, custom sections etc.
 * 
 */

import type { ScanQuestion } from "./types.js";

export const questions: ScanQuestion[] = [
  {
		id: 'identify-1',
		function: 'Identify',
		prompt:
			'Does your organisation maintain an inventory of critical assets and a documented process to identify and assess risks, including those from third-party suppliers and partners?',
		guidance:
			'Is this formalised, reviewed regularly, approved by senior management? Does it cover third-party relationships?',
	},
	{
		id: 'protect-1',
		function: 'Protect',
		prompt:
			'Is multi-factor authentication (MFA) deployed for critical access points?',
		guidance:
			'Think about VPNs, privileged accounts, sensitive applications',
	},
	{
		id: 'detect-1',
		function: 'Detect',
		prompt:
			'Do you have centralised log monitoring (SIEM, ELK or equivalent) to detect abnormal behaviour?',
		guidance: 'Are automatic alerts already in place? Is there someone to consistently monitor them?',
	},
	{
		id: 'respond-1',
		function: 'Respond',
		prompt:
			'Is there an incident response plan that has been tested (crisis exercise, tabletop exercise) within the last 6 months?',
		guidance: 'If there has been, when was the last exercise?',
	},
	{
		id: 'recover-1',
		function: 'Recover',
		prompt:
			'Do you have a tested backup and recovery plan that would allow you to restore critical systems and data within an acceptable timeframe after an incident?',
		guidance: 'How often backups/recovery procedures are teste? Do you know the target recovery time?',
	},
];
