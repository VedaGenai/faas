# from fastapi import APIRouter, HTTPException, UploadFile, File
# from app.services.llm_service import LLMService
# from app.services.dashboard_service import DashboardService
# from app.utils.helpers import process_pdf, handle_role_selection
# from app.models.response_models import JobAnalysisResponse, DashboardResponse
# import logging
# from typing import List, Dict, Any

# # Initialize router and logger
# analyze_job_description_router = APIRouter()
# create_dashboards_router = APIRouter()
# logger = logging.getLogger(__name__)


# @analyze_job_description_router.post("/analyze_job_description/", response_model=JobAnalysisResponse)
# async def analyze_job_description(file: UploadFile = File(...)):
#     try:
#         text = await process_pdf(file)
#         # Create an instance of LLMService
#         llm_service = LLMService()
#         roles, skills_data, content, thresholds = await llm_service.process_job_description(text)
        
#         response_dict = {
#             "roles": roles,
#             "skills_data": skills_data,
#             "content": content,
#             "analysis": {
#                 "role": roles[0] if roles else "",
#                 "skills": skills_data
#             }
#         }

#         selection_threshold, rejection_threshold = thresholds

#         return JobAnalysisResponse(
#             roles=roles,
#             skills_data=skills_data,
#             formatted_data=response_dict,
#             selection_threshold=selection_threshold,
#             rejection_threshold=rejection_threshold,
#             status="success",
#             raw_response=content
#         )
#     except Exception as e:
#         logger.error(f"Analysis error: {str(e)}")
#         raise HTTPException(status_code=500, detail=str(e))



# @create_dashboards_router.post("/create-dashboards/", response_model=DashboardResponse)
# async def create_dashboards(
#     roles: List[str],
#     skills_data: Dict[str, Any],
#     number_of_dashboards: int = 1
# ):
#     try:
#         dashboard_service = DashboardService()
#         processed_data = []
        
#         for role in roles:
#             if role in skills_data:
#                 # Create dashboard with splits
#                 dashboard = dashboard_service.create_dynamic_dashboard(
#                     skills_data[role],
#                     'skills',
#                     {
#                         'number_of_dashboards': number_of_dashboards,
#                         'role': role
#                     }
#                 )
                
#                 # If splits exist, add them to processed data
#                 if 'splits' in dashboard:
#                     for split in dashboard['splits']:
#                         split['role'] = role
#                         processed_data.append(split)
#                 else:
#                     # Add single dashboard with title
#                     processed_data.append({
#                         'title': f'{role} Dashboard',
#                         'description': f'Complete analysis for {role}',
#                         'data': dashboard['data'],
#                         'role': role
#                     })
        
#         selection_threshold, rejection_threshold = dashboard_service.calculate_threshold_scores(skills_data)
        
#         return DashboardResponse(
#             status="success",
#             message=f"Successfully created {len(processed_data)} dashboards",
#             dashboards=processed_data,
#             selection_threshold=selection_threshold,
#             rejection_threshold=rejection_threshold,
#             number_of_dashboards=number_of_dashboards
#         )
#     except Exception as e:
#         logger.error(f"Dashboard creation error: {str(e)}")
#         return DashboardResponse(
#             status="error",
#             message=str(e),
#             dashboards=[],
#             selection_threshold=0,
#             rejection_threshold=0,
#             number_of_dashboards=0
#         )

# from fastapi import APIRouter, HTTPException, UploadFile, File
# from app.services.llm_service import LLMService
# from app.services.dashboard_service import DashboardService
# from app.utils.helpers import process_pdf, handle_role_selection
# from app.models.response_models import JobAnalysisResponse, DashboardResponse
# import logging
# from typing import List, Dict, Any

# analyze_job_description_router = APIRouter()
# create_dashboards_router = APIRouter()
# logger = logging.getLogger(__name__)

# @analyze_job_description_router.post("/analyze_job_description/", response_model=JobAnalysisResponse)
# async def analyze_job_description(file: UploadFile = File(...)):
#     try:
#         text = await process_pdf(file)
#         llm_service = LLMService()
#         roles, skills_data, content, thresholds, selected_prompts = await llm_service.process_job_description(text)
        
#         response_dict = {
#             "roles": roles,
#             "skills_data": skills_data,
#             "content": content,
#             "analysis": {
#                 "role": roles[0] if roles else "",
#                 "skills": skills_data
#             }
#         }

#         selection_threshold, rejection_threshold = thresholds

#         return JobAnalysisResponse(
#             roles=roles,
#             skills_data=skills_data,
#             formatted_data=response_dict,
#             selection_threshold=selection_threshold,
#             rejection_threshold=rejection_threshold,
#             status="success",
#             raw_response=content,
#             selected_prompts=selected_prompts
#         )
#     except Exception as e:
#         logger.error(f"Analysis error: {str(e)}")
#         raise HTTPException(status_code=500, detail=str(e))

# @analyze_job_description_router.post("/run_custom_prompt/")
# async def run_custom_prompt(prompt: str, skills_data: Dict[str, Any]):
#     try:
#         llm_service = LLMService()
#         updated_skills_data = await llm_service.process_custom_prompt(prompt, skills_data)
        
#         dashboard_service = DashboardService()
#         selection_threshold, rejection_threshold = dashboard_service.calculate_threshold_scores(updated_skills_data)
        
#         return {
#             "status": "success",
#             "updated_skills_data": updated_skills_data,
#             "selection_threshold": selection_threshold,
#             "rejection_threshold": rejection_threshold
#         }
#     except Exception as e:
#         logger.error(f"Custom prompt error: {str(e)}")
#         raise HTTPException(status_code=500, detail=str(e))

# @create_dashboards_router.post("/create-dashboards/", response_model=DashboardResponse)
# async def create_dashboards(
#     roles: List[str],
#     skills_data: Dict[str, Any],
#     number_of_dashboards: int = 1
# ):
#     try:
#         dashboard_service = DashboardService()
#         processed_data = []
        
#         for role in roles:
#             if role in skills_data:
#                 dashboard = dashboard_service.create_dynamic_dashboard(
#                     skills_data[role],
#                     'skills',
#                     {
#                         'number_of_dashboards': number_of_dashboards,
#                         'role': role
#                     }
#                 )
                
#                 if 'splits' in dashboard:
#                     for split in dashboard['splits']:
#                         split['role'] = role
#                         processed_data.append(split)
#                 else:
#                     processed_data.append({
#                         'title': f'{role} Dashboard',
#                         'description': f'Complete analysis for {role}',
#                         'data': dashboard['data'],
#                         'role': role
#                     })
        
#         selection_threshold, rejection_threshold = dashboard_service.calculate_threshold_scores(skills_data)
        
#         return DashboardResponse(
#             status="success",
#             message=f"Successfully created {len(processed_data)} dashboards",
#             dashboards=processed_data,
#             selection_threshold=selection_threshold,
#             rejection_threshold=rejection_threshold,
#             number_of_dashboards=number_of_dashboards
#         )
#     except Exception as e:
#         logger.error(f"Dashboard creation error: {str(e)}")
#         return DashboardResponse(
#             status="error",
#             message=str(e),
#             dashboards=[],
#             selection_threshold=0,
#             rejection_threshold=0,
#             number_of_dashboards=0
#         )

from fastapi import APIRouter, HTTPException, UploadFile, File
from app.services.llm_service import LLMService
from app.services.dashboard_service import DashboardService
from app.utils.helpers import process_pdf, handle_role_selection
from app.models.response_models import JobAnalysisResponse, DashboardResponse
import logging
from typing import List, Dict, Any

analyze_job_description_router = APIRouter()
create_dashboards_router = APIRouter()
logger = logging.getLogger(__name__)

@analyze_job_description_router.post("/analyze_job_description/", response_model=JobAnalysisResponse)
async def analyze_job_description(file: UploadFile = File(...)):
    try:
        text = await process_pdf(file)
        llm_service = LLMService()
        roles, skills_data, content, thresholds, selected_prompts = await llm_service.process_job_description(text)
        
        response_dict = {
            "roles": roles,
            "skills_data": skills_data,
            "content": content,
            "analysis": {
                "role": roles[0] if roles else "",
                "skills": skills_data
            }
        }
        print(response_dict)

        selection_threshold, rejection_threshold = thresholds

        return JobAnalysisResponse(
            roles=roles,
            skills_data=skills_data,
            formatted_data=response_dict,
            selection_threshold=selection_threshold,
            rejection_threshold=rejection_threshold,
            status="success",
            raw_response=content,
            selected_prompts=selected_prompts
        )
    except Exception as e:
        logger.error(f"Analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@analyze_job_description_router.post("/run_custom_prompt/")
async def run_custom_prompt(prompt: str):
    try:
        llm_service = LLMService()
        updated_skills_data = await llm_service.process_custom_prompt(prompt)
        
        dashboard_service = DashboardService()
        selection_threshold, rejection_threshold = dashboard_service.calculate_threshold_scores(updated_skills_data)
        
        return {
            "status": "success",
            "updated_skills_data": updated_skills_data,
            "selection_threshold": selection_threshold,
            "rejection_threshold": rejection_threshold
        }
    except Exception as e:
        logger.error(f"Custom prompt error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@create_dashboards_router.post("/create-dashboards/", response_model=DashboardResponse)
async def create_dashboards(
    roles: List[str],
    skills_data: Dict[str, Any],
    number_of_dashboards: int = 1
):
    try:
        dashboard_service = DashboardService()
        processed_data = []
        
        for role in roles:
            if role in skills_data:
                dashboard = dashboard_service.create_dynamic_dashboard(
                    skills_data[role],
                    'skills',
                    {
                        'number_of_dashboards': number_of_dashboards,
                        'role': role
                    }
                )
                
                if 'splits' in dashboard:
                    for split in dashboard['splits']:
                        split['role'] = role
                        processed_data.append(split)
                else:
                    processed_data.append({
                        'title': f'{role} Dashboard',
                        'description': f'Complete analysis for {role}',
                        'data': dashboard['data'],
                        'role': role
                    })
        
        selection_threshold, rejection_threshold = dashboard_service.calculate_threshold_scores(skills_data)
        
        return DashboardResponse(
            status="success",
            message=f"Successfully created {len(processed_data)} dashboards",
            dashboards=processed_data,
            selection_threshold=selection_threshold,
            rejection_threshold=rejection_threshold,
            number_of_dashboards=number_of_dashboards
        )
    except Exception as e:
        logger.error(f"Dashboard creation error: {str(e)}")
        return DashboardResponse(
            status="error",
            message=str(e),
            dashboards=[],
            selection_threshold=0,
            rejection_threshold=0,
            number_of_dashboards=0
        )














