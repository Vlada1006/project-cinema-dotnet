﻿using Cinema_project_dotnet.BusinessLogic.DTOs;
using Cinema_project_dotnet.BusinessLogic.DTOs.FilmDTO;
using Cinema_project_dotnet.BusinessLogic.Entities;

namespace Cinema_project_dotnet.BusinessLogic.Helpers
{
    public class ApplicationProfile : AutoMapper.Profile
    {
        public ApplicationProfile()
        {
            CreateMap<Film, FilmGetDTO>()
                .ForMember(dest => dest.Genres, opt => opt.MapFrom(src => src.FilmGenres.Select(fg => fg.Genre)))
                .ForMember(dest => dest.Directors, opt => opt.MapFrom(src => src.FilmDirectors.Select(fd => fd.Director)));

            CreateMap<FilmCreateUpdateDTO, Film>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.FilmGenres, opt => opt.Ignore())
                .ForMember(dest => dest.FilmDirectors, opt => opt.Ignore());

            CreateMap<Genre, GenreDTO>().ReverseMap();
            CreateMap<Director, DirectorDTO>().ReverseMap();
        }
    }
}
